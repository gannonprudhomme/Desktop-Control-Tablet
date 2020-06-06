import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCloud, faCloudRain, faSun, faCloudShowersHeavy, faBolt, faQuestion, IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

import * as styles from './WeatherDisplay.css';
import socket from '../../../framework/SocketHandler';

const weatherIconMap = new Map<string, IconDefinition>();
weatherIconMap.set('Clear', faSun);
weatherIconMap.set('Sunny', faSun);
weatherIconMap.set('Mostly Sunny', faSun);
weatherIconMap.set('Thunderstorms', faBolt);
weatherIconMap.set('Cloudy', faCloud);
weatherIconMap.set('Rain', faCloudRain);

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
      <FontAwesomeIcon
        // Show a question mark if the type can't be found, so we know to add it
        icon={weatherIconMap.get(weatherType) ?? faQuestion}
        className={styles.weatherIcon}
      />
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
