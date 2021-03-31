import { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import StopIcon from '@material-ui/icons/Stop';
import { Box } from '@material-ui/core';
import { VideoContext } from '../context'
import { Link } from 'react-router-dom';


const useStyles = makeStyles({
  root: {
    paddingTop: 50,
    maxWidth: "70%",
    marginLeft: "auto",
    marginRight: "auto"
  },
  card: {
    width: 400,
  },
  video: {
    width: "100%",
    height: "100%",
    minHeight: 276,
    marginLeft: "auto",
    marginRight: "auto",
  },
  loading: {
    width: "100%",
    height: 276
  },
  link: {
    color: 'inherit',
    textDecoration : 'none',
    display:'flex'
  }
});

function VideoRecorder() {
  const classes = useStyles();
  const videoRef = useRef()
  
  const { id } = useParams()
  const constraints = {
    audio: true,
    video: true
  };

  const [textBtnPlay, setTextBtnPlay] = useState('Start recording')
  const [errorMsg, setErrorMsg] = useState('');
  const [stream, setStream] = useState(null)
  const [mediaRecorder, setMediaRecorder] = useState({})
  const [recordedBlobs, setRecordedBlobs] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState({})
  const { setVideo, questions } = useContext(VideoContext)
  
  useEffect(() => {
    cleanVideo()
    existQuestion()
  }, [id]);

  useEffect(() => {
    getPermissions()
    existQuestion()
  }, [])

  useEffect(() => {
    if(recordedBlobs.length) {
      const superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
      videoRef.current.src = null;
      videoRef.current.srcObject = null;
      videoRef.current.autoPlay = false;
      videoRef.current.controls = true;
      videoRef.current.src = window.URL.createObjectURL(superBuffer);
      videoRef.current.muted = false;
      setVideo(id, recordedBlobs)
    }
  }, [recordedBlobs]);

  const existQuestion = () => {
    const foundQuestion = questions.find(item => item.id === id)
    setCurrentQuestion(foundQuestion)
    if(foundQuestion.video)
      setRecordedBlobs(foundQuestion.video)
  }

  const getPermissions = async () => {
    try {
      const str = await navigator.mediaDevices.getUserMedia(constraints);
      setStream( _ => str)
      videoRef.current.srcObject = str;
    } catch (e) {
      handleError(e);
    }
  }

  const handleDeleteBtn = () => {
    cleanVideo()
    setVideo(id, [])
  }
  const cleanVideo = () => {
    if(videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.controls = false;
      videoRef.current.autoPlay = true;
      videoRef.current.muted = true;
      setRecordedBlobs([])
      setMediaRecorder({})
    }
  }
  const handleRecordBtn = async () => {
    if (textBtnPlay == 'Start recording') {
      cleanVideo()

      startRecording()
      setTextBtnPlay('Stop recording')
    }
    else {
      stopRecording()
      setTextBtnPlay('Start recording')
    }
  }

  const startRecording = () => {
    let options = {mimeType: 'video/webm;codecs=vp9,opus'};
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.error(`${options.mimeType} is not supported`);
      options = {mimeType: 'video/webm;codecs=vp8,opus'};
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.error(`${options.mimeType} is not supported`);
        options = {mimeType: 'video/webm'};
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          console.error(`${options.mimeType} is not supported`);
          options = {mimeType: ''};
        }
      }
    }
    let mediaRec
    try {
      mediaRec = new MediaRecorder(stream, options);
      setMediaRecorder(_ => mediaRec)
    } catch (e) {
      console.error('Exception while creating MediaRecorder:', e);
      setErrorMsg(`Exception while creating MediaRecorder: ${JSON.stringify(e)}`);
      return;
    }
  
    console.log('Created MediaRecorder', mediaRec, 'with options', options);
    mediaRec.onstop = (event) => {
      console.log('Recorder stopped: ', event);
      console.log('Recorded Blobs: ', recordedBlobs);
    };
    mediaRec.ondataavailable = handleDataAvailable;
    mediaRec.start();
    console.log('MediaRecorder started', mediaRec);

  }
  const stopRecording = () => {
    mediaRecorder.stop();
  }
  const handleDataAvailable = (event) => {
    console.log('handleDataAvailable', event);
    if (event.data && event.data.size > 0) {
      setRecordedBlobs([...recordedBlobs, event.data])
    }    
  }
  const handleError = (error) => {
    if (error.name === 'ConstraintNotSatisfiedError') {
      const v = constraints.video;
      setErrorMsg(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
    } else if (error.name === 'PermissionDeniedError') {
      setErrorMsg('Permissions have not been granted to use your camera and ' +
        'microphone, you need to allow the page access to your devices in ' +
        'order for the demo to work.');
    }
    setErrorMsg(`getUserMedia error: ${error.name}`);
    if (typeof error !== 'undefined') {
      console.error(error);
    }
  }

  return (
    
    <div className={classes.root}>
      <Typography variant="h3" component="h2" gutterBottom align="center">
        {`${(id.split('-'))[1]}.- ${currentQuestion.question}`}
      </Typography>
      <Box display="flex" justifyContent="space-between">
      {
        (id.split('-'))[1] > 1 ?
        <Link className={classes.link} to={`/video-recorder/question-${Number((id.split('-'))[1])-1}`} >
          <Button size="small" color="primary">Prev</Button>
        </Link>
        :
        <Button size="small" color="primary" disabled>Prev</Button>
      }
      <Card className={classes.card}>
        <CardContent>
          <video className={classes.video} ref={videoRef} autoPlay playsInline muted></video>
          {errorMsg && <p>{errorMsg}</p>}
        </CardContent>
        <CardActions>
          {
            recordedBlobs.length > 0 ?
            <Button size="small" color="secondary" onClick={handleDeleteBtn}>
              Delete Recording
              <DeleteForeverIcon color="secondary"/>
            </Button>
            :
            <Button size="small" color="primary" onClick={handleRecordBtn}>
              {textBtnPlay}
              {
                textBtnPlay == 'Start recording' ?
                <FiberManualRecordIcon color="secondary"/>
                :
                <StopIcon color="secondary"/>
              }
              
            </Button>
          }
          
        </CardActions>
      </Card>
      {
        (id.split('-'))[1] < questions.length ?
        <Link className={classes.link} to={`/video-recorder/question-${Number((id.split('-'))[1])+1}`} >
          <Button size="small" color="primary" >Next</Button>
        </Link>
        :
        <Button size="small" color="primary" disabled>Next</Button>
      }
      </Box>
      <Box display="flex" justifyContent="center" mt={10}>
        <Link className={classes.link} to="/" >
          <Button size="small" color="primary">Go to list of questions</Button>
        </Link>
      </Box>
    </div>
  );
}

export default VideoRecorder;
