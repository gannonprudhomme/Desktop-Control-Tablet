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
  lightHue: number;
  lightSaturation: number;
  lightTemperature: number;
  lightBrightness: number;
}

let lastChange = 0;

/**
 * The container for a single SmartLight. Contains the methods for
 */
const SmartLightSlider: React.FC<SmartLightSliderProps> = ({ light, lightHue, lightSaturation, lightTemperature, lightBrightness }) => {
  const SKIP_DELAY = 500; // If we changed it within the last half second, ignore

  const [brightness, setBrightness] = React.useState(light.brightness);
  const [temperature, setTemperature] = React.useState(light.colorTemp ?? 3600);
  const [hue, setHue] = React.useState(light.hue ?? 0); // no clue what data type I'm using for this
  const [showingHue, setShowingHue] = React.useState(light.hue === 0 && light.saturation === 0);

  // console.log(`${lightHue} ${lightSaturation} ${lightTemperature} ${lightBrightness}`);

  // TODO: Double check the setShowingHue functionality here
  React.useEffect(() => {
    const now = new Date().getTime();

    if (now - lastChange < SKIP_DELAY) {
      console.log('skipping');
      return;
    } else {
      console.log('setting');
    }

    if (hue !== lightHue) {
      setHue(lightHue);

      // TODO: Double check this functionality
      if (hue === 0 && lightSaturation === 0) {
        if (showingHue) {
          setShowingHue(false)
        }
      } else {
        if (!showingHue) {
          console.log('setting show hue')
          setShowingHue(true)
        }
      }
    }

    if (temperature !== lightTemperature) {
      setTemperature(lightTemperature);

      console.log('setting show temp')
      setShowingHue(false);
    }

    if (brightness !== lightBrightness) {
      setBrightness(lightBrightness);
    }
  }, [lightHue, lightSaturation, lightTemperature, lightBrightness])

  // Retrieve these from the light, these values are just the defaults
  // We need defaults, since not all lights will have these properties
  const minTemp = 1500; // LIFX A19's minimum is 2500K
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
        setShowingHue(!showingHue);
        lastChange = new Date().getTime();
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
        lastChange = new Date().getTime();
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
          smartLightSockets.setHue(light, 360 - value);
          setHue(value);
          lastChange = new Date().getTime();
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
            const brightnessVal = Number(value);
            // Ignore duplicate changes
            // should help in overloading the light
            if (brightness !== brightnessVal) {
              smartLightSockets.setBrightness(light, brightnessVal);
            } else {
              console.log('skipping setting brightness')
            }
            setBrightness(brightnessVal);
            lastChange = new Date().getTime();
          })}

          <div className={sliderStyles.sliderInfoContainer}>
            <span className="brightness-value">
              {`${brightness}%`}
            </span>
            <button
              type="button"
              className={commonStyles.imageButton}
              onClick={(): void => {
                smartLightSockets.togglePower(light);
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
          {showingHue ? hueContainer : temperatureContainer}
        </div>
      </div>
    </div>
  );
};

export default SmartLightSlider;
