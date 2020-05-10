import * as React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/reducer';
import Song from '../../../types/Song';
import * as styles from './TrackDisplay.css';

/**
 * Displays the currently displaying song in Spotify
 */
const TrackDisplay: React.FC = () => {
  const currentSong = useSelector<RootState, Song>((state) => state.currentlyPlaying);

  return (
    <div id={styles.track}>
      <img
        id={styles.albumCover}
        src={currentSong.albumArt}
        alt="album cover"
      />

      <div id={styles.trackInfo}>
        <span id={styles.currentTrack}>
          {currentSong.songTitle}
        </span>
        <span id={styles.currentArtist}>
          {currentSong.artistName}
        </span>
      </div>
    </div>
  );
};

export default TrackDisplay;
