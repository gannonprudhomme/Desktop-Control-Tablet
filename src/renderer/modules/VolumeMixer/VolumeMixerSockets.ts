/**
 * Deals with the server communication
*/

import VolumeProcess from './VolumeProcess';
import socket from '../../framework/SocketHandler';
import * as volumeSettings from './settings.json';

// Might want to make this a class and add constructor checks?
interface ProcessSettings {
  name: string;
  priority: number;
  combine: boolean; // can be null
}

export default class VolumeMixerSockets {
  socket: SocketIOClient.Socket;
  /** List of volume process names to ignore */
  ignoreList: Set<string>;
  processSettings: Map<string, ProcessSettings>;

  constructor(sock: SocketIOClient.Socket) {
    this.socket = sock;
    this.ignoreList = new Set<string>();

    if (volumeSettings.ignore) {
      volumeSettings.ignore.forEach((name: string): Set<string> => this.ignoreList.add(name));
    }

    this.processSettings = new Map<string, ProcessSettings>();
    if (volumeSettings.processSettings) {
      volumeSettings.processSettings.forEach(
        (val: ProcessSettings) => this.processSettings.set(val.name, val),
      );
    }
  }

  // TODO: Should probably test the deserializing of this
  getProcesses(): Promise<VolumeProcess[]> {
    return new Promise((res) => {
      this.socket.emit('get_volume_processes', null, (data: any[]) => {
        // Convert it to the thing
        let volumeProcs: VolumeProcess[] = data.map((proc) => {
          // Just unwrap proc probably
          const {
            pid, name, volume, dominantColor,
          } = proc;
          return new VolumeProcess({
            processID: pid, name, volume, dominantColor,
          });
        });

        // Filter out the processes to ignore from volumeSettings.ignore
        volumeProcs = volumeProcs.filter((proc): boolean => !(this.ignoreList.has(proc.name)));

        const getPriority = (proc: VolumeProcess): number => (
          // Probably an easier way of doing this
          this.processSettings.has(proc.name) ? this.processSettings.get(proc.name).priority : 0
        );

        volumeProcs = volumeProcs.sort((a, b): number => getPriority(b) - getPriority(a));

        res(volumeProcs);
      });
    });
  }

  /**
   * Sets the program volume for the given process id
   * @param pid The id of the process to change the volume from
   * @param volume The volume to set the given process to
   */
  setVolume(pid: number, volume: number): void {
    this.socket.emit('set_volume_proc', { pid, volume });
  }
}

export const volumeMixerSockets = new VolumeMixerSockets(socket);
