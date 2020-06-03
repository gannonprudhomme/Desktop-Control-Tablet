import * as React from 'react';
import { Slider, withStyles } from '@material-ui/core';
import VolumeProcess from '../VolumeProcess';
import * as styles from './VolumeSlider.css';
import { volumeMixerSockets } from '../VolumeMixerSockets';

interface VolumeSliderProps {
  volumeProcess: VolumeProcess;
}

/** TODO
 *  - Make the thumb not go too far off the rail (maybe to its center)
 *  - Add the colors to the buttons & label for each icon
 */
const thumbSize = 36;
const VolSliderUI = withStyles({
  root: {
    color: '#999999',
    width: '8px !important',
  },
  thumb: {
    width: thumbSize,
    height: thumbSize,
    // Change this to use the dominant color of the program icon
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    // marginTop: '0px !important',
    marginLeft: '-12px !important',
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  // idek what this
  track: {
    width: '12px !important',
    borderRadius: 4,
  },
  rail: {
    width: '12px !important',
    borderRadius: 4,
  },
})(Slider);

const VolumeSlider: React.FC<VolumeSliderProps> = ({ volumeProcess }) => {
  const [volume, setVolume] = React.useState(volumeProcess.volume);

  React.useEffect(() => {
    setVolume(volumeProcess.volume);
  }, [volumeProcess]);

  return (
    <div
      className={styles.sliderContainer}
      style={{
        marginTop: thumbSize,
      }}
    >
      <VolSliderUI
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

      <div className={styles.sliderInfoContainer}>
        <span className={styles.sliderLabel}>
          {`${volume}% `}
        </span>
        <img
          className={styles.sliderIcon}
          // Get the icon from the Electron server
          src={`http://localhost:3000/icons/${volumeProcess.name}`}
          alt=""
        />
        {volumeProcess.name}
      </div>
    </div>
  );
};

export default VolumeSlider;
