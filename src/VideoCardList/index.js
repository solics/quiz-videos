import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import Q_IMG from '../assets/img/question.jpg'
import { green } from '@material-ui/core/colors';
import { Link } from 'react-router-dom';
import { VideoContext } from '../context'

const useStyles = makeStyles({
  root: {
    maxWidth: 1200,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 40,
  },
  card: {
    maxWidth: 345,
    margin: 'auto',
  },
  media: {
    height: 140,
  },
  link: {
    color: 'inherit',
    textDecoration : 'none'
  }
});


const VideoCardList = () => {
  const { questions } = useContext(VideoContext)
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography variant="h3" component="h2" gutterBottom align="center">
        Answer the questions
      </Typography>
      <Grid container direction="row" justify="space-between" alignItems="center" spacing={4}>
        {questions.map(question => {
          return (
            <Grid item md={3} sm={6} xs={12}>
              <Card className={classes.card} key={question.id}>
                <Link className={classes.link} to={`/video-recorder/${question.id}`} >
                  <CardActionArea>
                    <CardMedia
                      className={classes.media}
                      image={Q_IMG}
                      title="Contemplative Reptile"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="h2">
                        {question.question}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Link>
                <CardActions>
                  { 
                    question.video ?
                    <DoneOutlineIcon style={{ color: green[500] }}/>
                    :
                    <HourglassEmptyIcon color="secondary" />
                  }
                </CardActions>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </div>);
}

export default VideoCardList;
