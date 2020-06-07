import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCloud, faCloudRain, faSun, faCloudShowersHeavy, faBolt, faQuestion, IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

import * as styles from './WeatherDisplay.css';
import socket from '../../../framework/SocketHandler';

/** Regex for weather modifiers to ignore */
const weatherIgnoreRegex = /(?:Partly\s*)|(?:Mostly\s*)/;
const weatherIconMap = new Map<string, IconDefinition>();
weatherIconMap.set('Clear', faSun);
weatherIconMap.set('Sunny', faSun);
weatherIconMap.set('Thunderstorms', faBolt);
weatherIconMap.set('Cloudy', faCloud);
weatherIconMap.set('Rain', faCloudRain);

/**
 * Displays the current weather and temperature
 */
const WeatherDisplay: React.FC = () => {
  const [weatherType, setWeatherType] = React.useState('Sunny');
  const [temperature, setTemperature] = React.useState(0);

  function getForecast(): void {
    // arrange
    socket.emit('get_forecast', null, (data: any) => {
      const { currentWeather, currentTemp } = data;

      setWeatherType(currentWeather);
      setTemperature(currentTemp);
    });
  }

  /** Trims the modifiers ("Partly", "Mostly") and attempts to retrieve the according icon for the
   *  resulting weather type. Returns a question mark if the according icon can't be found.
  */
  function getWeatherIcon(weather: string): IconDefinition {
    // Removes the modifiers from the string, such as "Partly" or "Mostly"
    const actualWeather = weather.split(
      weatherIgnoreRegex,
    ).filter(
      // Filter out falsy values since my regex doesn't do it for me
      (val) => Boolean(val),
    )[0]; // Get the first (and hopefully only) value

    // Return a question mark if it doesn't exist on it
    if (!(weatherIconMap.has(actualWeather))) {
      const icon = faQuestion;
      return icon;
    }

    return weatherIconMap.get(actualWeather);
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
  }, []);

  // Have an option for fahrehenit or celcius?
  // Maybe show high and low temps for the day?

  return (
    <div className={styles.weatherContainer}>
      <div className={styles.temperatureWeatherContainer}>
        <span id={styles.temperature}>
          {`${temperature}°F`}
        </span>
        <span>
          {weatherType}
        </span>
      </div>
      <FontAwesomeIcon
        // Show a question mark if the type can't be found, so we know to add it
        icon={getWeatherIcon(weatherType)}
        className={styles.weatherIcon}
      />
    </div>
  );
};

export default WeatherDisplay;
