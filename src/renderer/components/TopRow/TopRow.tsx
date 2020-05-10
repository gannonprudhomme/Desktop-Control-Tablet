import * as React from 'react';
import * as styles from './TopRow.css';
import PCControls from './PCControls/PCControls';
import TimeDisplay from './TimeDisplay/TimeDisplay';

/**
 * The TopRow of the view. Contains the PCControls, TimeDisplay, and Weather Display
 */
const TopRow: React.FC = () => (
  <div id={styles.topRow}>
    <PCControls />
    <TimeDisplay />
    <div>
      Weather
    </div>
  </div>
);

export default TopRow;
