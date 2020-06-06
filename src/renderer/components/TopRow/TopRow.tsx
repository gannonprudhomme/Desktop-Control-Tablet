import * as React from 'react';
import * as styles from './TopRow.css';
import PCControls from './PCControls/PCControls';
import TimeDisplay from './TimeDisplay/TimeDisplay';
import WeatherDisplay from './WeatherDisplay/WeatherDisplay';

/**
 * The TopRow of the view. Contains the PCControls, TimeDisplay, and Weather Display
 */
const TopRow: React.FC = () => (
  <div id={styles.topRow}>
    <PCControls />
    <TimeDisplay />
    <WeatherDisplay />
  </div>
);

export default TopRow;
