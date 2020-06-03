/**
 *
*/

import VolumeProcess from './VolumeProcess';

// action type strings
export const UPDATE_VOLUME_PROCESSES = 'UPDATE_VOLUME_PROCESSES';

// action type interface
export interface UpdateVolumeProcessesAction {
  type: 'UPDATE_VOLUME_PROCESSES';
  processes: VolumeProcess[];
}

// reducer
export default function volumeProcesses(state: VolumeProcess[] = [],
  action: UpdateVolumeProcessesAction): VolumeProcess[] {
  switch (action.type) {
    case UPDATE_VOLUME_PROCESSES:
      // Might want to sort the processes by their name? Just so it's not random
      return action.processes.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return state;
  }
}
