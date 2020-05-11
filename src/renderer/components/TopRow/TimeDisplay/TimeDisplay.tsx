import * as React from 'react';
import * as styles from './TimeDisplay.css';

/**
 * Displays the current time
 */
const TimeDisplay: React.FC = () => {
  const [time, setTime] = React.useState(new Date());

  // Converts the given time to 1:05 PM format
  function formatTime(now: Date): string {
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours %= 12;
    hours = hours || 12; // the hour 0 should be '12'
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}:${minutesStr} ${ampm}`;
  }

  // Set the interval to update the time every second
  // Must be in an useEffect, otherwise will cause infinite re-rendering
  React.useEffect(() => {
    let interval: NodeJS.Timeout = null;

    interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return () => clearInterval(interval);
  }, [time]);

  return (
    <div id={styles.time}>
      {formatTime(time)}
    </div>
  );
};

export default TimeDisplay;
