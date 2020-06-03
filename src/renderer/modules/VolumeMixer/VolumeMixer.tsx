import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/reducer';
import VolumeProcess from './VolumeProcess';
import updateVolumeProcesses from './action';
import { volumeMixerSockets } from './VolumeMixerSockets';
import VolumeSlider from './VolumeSlider/VolumeSlider';
import * as styles from './VolumeMixer.css';

/**
 * Represents the entire volume mixer module
 */
const VolumeMixer: React.FC = () => {
  const dispatch = useDispatch();
  // TODO: Could pass these in to remove the dependency cycle
  const volumeProcs = useSelector<RootState, VolumeProcess[]>((state) => state.volumeProcesses);

  const mixers: JSX.Element[] = [];

  volumeProcs.forEach((proc) => {
    mixers.push(
      <VolumeSlider volumeProcess={proc} key={`${proc.processID}`} />,
    );
  });

  // Get the processes
  React.useEffect(() => {
    let interval: NodeJS.Timeout = null;

    interval = setInterval(() => {
      volumeMixerSockets.getProcesses().then((procs) => {
        dispatch(updateVolumeProcesses(procs));
      });
    }, 1000);

    return (): void => clearInterval(interval);
  });

  return (
    <div id={styles.volumeMixer} className="middle-view">
      {mixers}
    </div>
  );
};

export default VolumeMixer;
