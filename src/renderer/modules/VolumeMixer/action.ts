import VolumeProcess from './VolumeProcess';
import { UpdateVolumeProcessesAction, UPDATE_VOLUME_PROCESSES } from './reducer';

/**
 *
 * @param processes The new volume processes
 */
export default function updateVolumeProcesses(
  processes: VolumeProcess[],
): UpdateVolumeProcessesAction {
  return {
    type: UPDATE_VOLUME_PROCESSES,
    processes,
  };
}
