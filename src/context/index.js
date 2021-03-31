import React from 'react'
const questions = [
  {id: 'question-1', question: '¿Que es una clase?', video: null},
  {id: 'question-2', question: '¿Que es un objeto?', video: null},
  {id: 'question-3', question: '¿Que es una instancia?', video: null},
  {id: 'question-4', question: '¿Que es herencia?', video: null},
  {id: 'question-5', question: '¿Que es "this"?', video: null},
]
const setVideo = (id, videoData) => {
  const foundVideo = questions.find(item => item.id === id)
  foundVideo.video = videoData
}
const VideoContext = React.createContext();

const VideoContextProvider = ({children}) => {
  return <VideoContext.Provider value={{questions, setVideo}}>
    {children}
  </VideoContext.Provider>
}
export {
  VideoContext,
  VideoContextProvider,
}