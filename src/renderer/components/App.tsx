import * as React from 'react';
import { useDispatch } from 'react-redux';

import TopRow from './TopRow/TopRow';
import MiddleRow from './MiddleRow/MiddleRow';
import BottomRow from './BottomRow/BottomRow';
import * as styles from './App.css';
import changeCurrentlyPlaying from '../redux/actions/currentlyPlaying';
import { spotifyController } from '../framework/SpotifyController';
import {
  setModulesArray, changeCurrentModule, showServerRequiredModules, hideServerRequiredModules,
} from '../redux/actions/modules';

import { defaultModule, currentModules } from '../modules/ModulesManager';
import socket from '../framework/SocketHandler';

const App: React.FC = () => {
  const dispatch = useDispatch();

  // Wrapping this in an effect ensures it's only going to be run once, since dispatch
  // is never going to change
  React.useEffect(() => {
    dispatch(setModulesArray(currentModules));
    dispatch(changeCurrentModule(defaultModule));
  }, [dispatch]);

  // TODO: Move this into TrackDisplay probably
  spotifyController.getSong().then(
    (song) => dispatch(changeCurrentlyPlaying(song)),
  );

  setInterval(() => {
    // Attempt to get the current song
    spotifyController.getSong().then(
      (song) => dispatch(changeCurrentlyPlaying(song)),
    );
  }, 500);

  // Local store of this so we can keep track if it changed or not
  let isConnected = false; // If we're connected to a desktop server
  setInterval(() => {
    // console.log('trying to send connectedToServer');
    socket.emit('connectedToServer', '', (connected: boolean) => {
      if (isConnected !== connected) { // If the state changed, update the displayed modules
        if (connected) {
          dispatch(showServerRequiredModules());
        } else {
          dispatch(hideServerRequiredModules());
        }
      }

      isConnected = connected;
    });
  }, 500);

  return (
    <div className={styles.gridContainer}>
      <TopRow />
      <MiddleRow />
      <BottomRow />
    </div>
  );
};

export default App;
