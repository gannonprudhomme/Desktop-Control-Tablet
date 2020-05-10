import * as React from 'react';
import { useDispatch } from 'react-redux';

import TopRow from './TopRow/TopRow';
import MiddleRow from './MiddleRow/MiddleRow';
import BottomRow from './BottomRow/BottomRow';
import * as styles from './App.css';
import { spotifyController } from '../framework/SocketHandler';
import changeCurrentlyPlaying from '../redux/actions/currentlyPlaying';

const App: React.FC = () => {
  const dispatch = useDispatch();

  spotifyController.getSong().then(
    (song) => dispatch(changeCurrentlyPlaying(song)),
  );

  setInterval(() => {
    // Attempt to get the current song
    spotifyController.getSong().then(
      (song) => dispatch(changeCurrentlyPlaying(song)),
    );
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
