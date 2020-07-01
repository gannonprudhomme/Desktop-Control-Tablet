import * as React from 'react';
import LoopIcon from '@material-ui/icons/Loop';
import SmartLight from '../SmartLight';
import CustomSlider from '../../../framework/CustomSlider/CustomSlider';
import { smartLightSockets } from '../SmartLightSockets';
import * as styles from './SmartLightSlider.css';
import * as sliderStyles from '../../../framework/CustomSlider/CustomSlider.css';
import * as commonStyles from '../../../framework/CommonStyles.css';
import HueSlider from './HueSlider/HueSlider';

const lightIcon = require('../../../../../public/assets/light-bulb.png');

interface SmartLightSliderProps {
  light: SmartLight;
}

/**
 * The container for a single SmartLight. Contains the methods for
 */
const SmartLightSlider: React.FC<SmartLightSliderProps> = ({ light }) => {
  const [brightness, setBrightness] = React.useState(light.brightness);
  const [temperature, setTemperature] = React.useState(light.colorTemp ?? 3600);
  const [hue, setHue] = React.useState(light.hue ?? 0); // no clue what data type I'm using for this
  const [showingRGB, setShowingRGB] = React.useState(false);

  // Set the react state according to the value of the SmartLight prop
  React.useEffect(() => {
    if (light.colorTemp) {
      setTemperature(light.colorTemp);
    }

    if (light.hue) {
      setTemperature(light.hue);
    }

    setBrightness(light.brightness);
  }, [light]);

  // Retrieve these from the light, these values are just the defaults
  // We need defaults, since not all lights will have these properties
  const minTemp = 3500;
  const maxTemp = 9000;

  function makeSlider(min: number, max: number, sliderValue: number,
    onChange: (event: React.ChangeEvent<{}>, value: number | number[]) => void): JSX.Element {
    return (
      <CustomSlider
        orientation="vertical"
        min={min}
        max={max}
        value={sliderValue}
        onChange={(event, value): void => onChange(event, value)}
      />
    );
  }

  const switchButton: JSX.Element = (
    <button
      type="button"
      className={commonStyles.imageButton}
      onClick={(): void => {
        setShowingRGB(!showingRGB);
      }}
    >
      <LoopIcon className={commonStyles.defaultIcon} />
    </button>
  );

  const temperatureContainer: JSX.Element = (
    <>
      {makeSlider(minTemp, maxTemp, temperature, (event, value) => { // onChange function
        const colorTemp = Number(value);

        event.preventDefault();
        smartLightSockets.setColorTemperature(light, colorTemp);
        setTemperature(colorTemp);
      })}

      <div className={sliderStyles.sliderInfoContainer}>
        <span className="temperature-value">
          {`${temperature}K`}
        </span>
        {switchButton}
      </div>
    </>
  );

  const hueContainer: JSX.Element = (
    <>
      <HueSlider
        lightHue={light.hue ?? 0}
        onChange={(value): void => {
          smartLightSockets.setHue(light, value);
          setHue(value);
        }}
      />

      <div className={sliderStyles.sliderInfoContainer}>
        <span className="hue-value">
          {`${hue}`}
        </span>
        {switchButton}
      </div>
    </>
  );

  return (
    <div className={styles.smartLightSliderContainer}>
      <span className={styles.lightName}>
        {light.name}
      </span>
      <div className={styles.lightsSliderContainer}>
        <div className={`${sliderStyles.sliderContainer} ${styles.overrideSliderContainer}`}>
          {makeSlider(0, 100, brightness, (event, value) => { // onChange function
            event.preventDefault();
            smartLightSockets.setBrightness(light, Number(value));
            setBrightness(Number(value));
          })}

          <div className={sliderStyles.sliderInfoContainer}>
            <span className="brightness-value">
              {`${brightness}%`}
            </span>
            <button
              type="button"
              className={commonStyles.imageButton}
              onClick={(): void => {
                console.log('stuff!');
              }}
            >
              <img
                className={sliderStyles.sliderIcon}
                src={lightIcon.default}
                alt=""
              />
            </button>
          </div>
        </div>
        {/* if the light isn't capable of RGB, don't show the container at all */}
        <div className={sliderStyles.sliderContainer}>
          {showingRGB ? hueContainer : temperatureContainer}
        </div>
      </div>
    </div>
  );
};

export default SmartLightSlider;
