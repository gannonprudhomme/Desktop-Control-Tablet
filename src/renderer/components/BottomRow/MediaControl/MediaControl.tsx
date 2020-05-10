import * as React from 'react';
import { useSelector } from 'react-redux';
import Song from '../../../types/Song';
import { RootState } from '../../../redux/reducer';
import * as styles from './MediaControl.css';
import MediaController from '../../../framework/MediaController';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nextSongImage = require('../../../../../public/assets/next-song.png');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const playImage = require('../../../../../public/assets/play.png');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pauseImage = require('../../../../../public/assets/pause.png');

// Pass in a MediaController so we can mock it without having to deal with socket mocking
interface MediaControlProps {
  mediaController: MediaController;
}

const MediaControl: React.FC<MediaControlProps> = ({ mediaController }) => {
  const currentSong = useSelector<RootState, Song>((state) => state.currentlyPlaying);

  return (
    <div id={styles.spotifyPlayback}>
      <div id={styles.playbackContainer}>
        <button
          type="button"
          className={styles.imageButton}
          onClick={(): void => {
            mediaController.previousSong();
          }}
          data-testid="previousSongButton"
        >
          <img id={styles.previousSong} src={nextSongImage.default} alt="" />
        </button>
        <button
          type="button"
          onClick={(): void => {
            mediaController.playPause();
          }}
          className={styles.imageButton}
        >
          <img
            id={styles.playPause}
            src={currentSong.isPlaying ? pauseImage.default : playImage.default}
            alt=""
            data-testid="playPauseButton"
          />
        </button>
        <button
          type="button"
          className={styles.imageButton}
          onClick={(): void => {
            mediaController.nextSong();
          }}
          data-testid="nextSongButton"
        >
          <img id={styles.nextSong} src={nextSongImage.default} alt="" />
        </button>
      </div>
    </div>
  );
};

export default MediaControl;
