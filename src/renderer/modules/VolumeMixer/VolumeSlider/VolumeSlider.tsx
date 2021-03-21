import * as React from 'react';
import CustomSlider from '../../../framework/CustomSlider/CustomSlider';
import VolumeProcess from '../VolumeProcess';
import * as sliderStyles from '../../../framework/CustomSlider/CustomSlider.css';
import * as styles from './VolumeSlider.css';
import { volumeMixerSockets } from '../VolumeMixerSockets';

interface VolumeSliderProps {
  volumeProcess: VolumeProcess;
}

/** TODO
 *  - Make the thumb not go too far off the rail (maybe to its center)
 *  - Add the colors to the buttons & label for each icon
 */
const VolumeSlider: React.FC<VolumeSliderProps> = ({ volumeProcess }) => {
  const [volume, setVolume] = React.useState(volumeProcess.volume);
  const [icon, setIcon] = React.useState('');
  const thumbSize = 36;

  function fetchIcon(processName: string): Promise<string> {
    const url = `http://localhost:3000/icons/${processName}`;

    return new Promise((resolve, reject) => {
      const request = new Request(url);

      fetch(request).then(
        (response) => response.blob(),
      ).then((data: Blob): void => {
        if (data.size <= 4) {
          reject(Error(`Icon received was empty for ${processName}`));
          return;
        }

        const imageUrl = URL.createObjectURL(data);
        resolve(imageUrl);
      });
    });
  }

  function timeout(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function fetchIconRetry(retryCount = 10): Promise<string> {
    try {
      return await fetchIcon(volumeProcess.name);
    } catch (err) {
      // Only throw the error once we've retried enough times
      if (retryCount === 1) {
        throw err;
      }

      console.log(`Failed to when getting ${volumeProcess.name} icon. Waiting to retry...`);
      await timeout(500); // Wait for half a second before retrying
      console.log(`Retrying getting ${volumeProcess.name} icon`);

      const newCount = retryCount - 1;
      return fetchIconRetry(newCount);
    }
  }

  React.useEffect(() => {
    // Have to await in async functions for async usage in React hooks
    async function getAndSetIcon(): Promise<void> {
      const iconUrl = await fetchIconRetry();

      setIcon(iconUrl);
    }

    getAndSetIcon();

  // I'm intetionally not passing in fetchIconRetry to prevent an infinite render-cycle
  // Could probably use React.useCallback?
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volumeProcess.name]);

  React.useEffect(() => {
    setVolume(volumeProcess.volume);
  }, [volumeProcess]);

  return (
    <div
      className={sliderStyles.sliderContainer}
      style={{
        marginTop: thumbSize,
      }}
    >
      <CustomSlider
        orientation="vertical"
        min={0}
        max={100}
        value={volume}
        onChange={(event, value): void => {
          event.preventDefault();
          volumeMixerSockets.setVolume(volumeProcess.processID, Number(value));
          setVolume(Number(value));
        }}
        data-testid={`${volumeProcess.name}-slider`}
      />

      <div className={sliderStyles.sliderInfoContainer}>
        <span className={sliderStyles.sliderLabel}>
          {`${volume}% `}
        </span>
        <img
          className={sliderStyles.sliderIcon}
          // Get the icon from the Electron server
          src={icon}
          alt=""
        />
        <span className={styles.processNameText}>
          {volumeProcess.name}
        </span>
      </div>
    </div>
  );
};

export default VolumeSlider;
