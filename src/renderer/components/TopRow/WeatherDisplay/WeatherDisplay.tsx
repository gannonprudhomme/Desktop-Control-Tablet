import * as React from 'react';

import * as styles from './WeatherDisplay.css';
import socket from '../../../framework/SocketHandler';

const icon = require('../../../../../public/assets/bulb.png');

/**
 * Displays the current weather and temperature
 */
const WeatherDisplay: React.FC = () => {
  const [weatherType, setWeatherType] = React.useState('Weather');
  const [temperature, setTemperature] = React.useState(0);

  function getForecast(): void {
    // arrange
    socket.emit('get_forecast', null, (data: any) => {
      const { currentWeather, currentTemp } = data;

      setWeatherType(currentWeather);
      setTemperature(currentTemp);
    });
  }

  // Retrieve on first render immediately
  getForecast();

  // Attempt to update the forecast every 5 seconds
  React.useEffect(() => {
    let interval: NodeJS.Timeout = null;

    interval = setInterval(() => {
      getForecast();
    }, 5000);

    return (): void => clearInterval(interval);
  }, [weatherType, temperature]);

  // Have an option for fahrehenit or celcius?
  // Maybe show high and low temps for the day?

  return (
    <div className={styles.weatherContainer}>
      <img src={icon.default} className={styles.weatherIcon} alt="weather" />
      <div className={styles.temperatureWeatherContainer}>
        <span id={styles.temperature}>
          {`${temperature}°F`}
        </span>
        <span>
          {weatherType}
        </span>
      </div>
    </div>
  );
};

export default WeatherDisplay;
