import * as React from 'react';
import TrackDisplay from './TrackDisplay/TrackDisplay';
import MediaControl from './MediaControl/MediaControl';
import * as styles from './BottomRow.css';
import ModuleSwitcher from './ModuleSwitcher/ModuleSwitcher';
import { spotifyController } from '../../framework/SpotifyController';

/**
 * The bottom row of the main page. Should always be shown, no matter what module we're showing
 */
const BottomRow: React.FC = () => {
  return (
    <div id={styles.bottomRow}>
      <TrackDisplay />
      <MediaControl mediaController={spotifyController} />
      <ModuleSwitcher />
    </div>
  );
};

export default BottomRow;
