import React from 'react';
import { Route, Router, Switch } from 'react-router';
import { createBrowserHistory } from "history";
import VideoCardList from './VideoCardList';
import VideoRecorder from './VideoRecorder';
import { VideoContextProvider } from './context/'

const customHistory = createBrowserHistory();

const App = () => {
  return (
    <VideoContextProvider>
      <Router history={customHistory}>
        <Switch>
          <Route exact path='/'>
            <VideoCardList />
          </Route>
          <Route path='/video-recorder/:id'>
            <VideoRecorder />
          </Route>
        </Switch>
      </Router>
    </VideoContextProvider>
  );
}

export default App;
