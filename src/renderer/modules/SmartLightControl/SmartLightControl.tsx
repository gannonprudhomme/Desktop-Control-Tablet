import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/reducer';
import SmartLight from './SmartLight';
import { smartLightSockets } from './SmartLightSockets';
import { initializeSmartLights, updateSmartLight } from './actions';
import SmartLightSlider from './SmartLightSlider/SmartLightSlider';
import * as styles from './SmartLightControl.css';

const SmartLightControl: React.FC = () => {
  const dispatch = useDispatch();
  const smartLights = useSelector<RootState, Map<string, SmartLight>>((state) => state.smartLights);

  // Map smartLights to a row (actually a column)
  const sliders: JSX.Element[] = React.useMemo(() => {
    const ret: JSX.Element[] = [];
    smartLights.forEach((light) => {
      ret.push(
        <SmartLightSlider
          light={light}
          key={light.name}
          lightHue={light.hue}
          lightBrightness={light.brightness}
          lightSaturation={light.saturation}
          lightTemperature={light.colorTemp}
        />,
      );
    });
    return ret;
  }, [smartLights])

  // Initialize the sockets
  React.useEffect(() => {
    smartLightSockets.getAllLights().then((lights) => {
      // console.log(`Retrieved ${lights.length} lights`);
      dispatch(initializeSmartLights(lights));
    });
  }, [dispatch]);

  /** Iterate through all of the current light and attempt to retrieve the current info on them */
  function updateLights(): void {
    // console.log(smartLights);
    if (!smartLights) { 
      console.log('smartLights is null in updateLights!');
      return;
    }

    for (let [key, value] of smartLights) {
      // console.log(`${key}: ${value}`)
      const light = value;
      if (!light) {
        console.log(`Received falsy light for key ${key}`);
        return;
      }

      smartLightSockets.getLightInfo(light).then((updatedLight) => {
        dispatch(updateSmartLight(updatedLight));
      });
    }
  }

  // Get light data every 5? seconds
  const pollingRate = 2000;
  React.useEffect(() => {
    let interval: NodeJS.Timeout = null;

    interval = setInterval(() => {
      updateLights();
    }, pollingRate);

    return (): void => clearInterval(interval);
  });

  return (
    <div className={styles.smartLightContainer}>
      {sliders}
    </div>
  );
};

export default SmartLightControl;
