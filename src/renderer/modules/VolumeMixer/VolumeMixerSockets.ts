/**
 * Deals with the server communication
*/

import VolumeProcess from './VolumeProcess';
import socket from '../../framework/SocketHandler';

export default class VolumeMixerSockets {
  socket: SocketIOClient.Socket;

  constructor(sock: SocketIOClient.Socket) {
    this.socket = sock;
  }

  // TODO: Should probably test the deserializing of this
  getProcesses(): Promise<VolumeProcess[]> {
    return new Promise((res) => {
      this.socket.emit('get_volume_processes', null, (data: any[]) => {
        // Convert it to the thing
        const volumeProcs: VolumeProcess[] = data.map((proc) => {
          // Just unwrap proc probably
          const {
            pid, name, volume, dominantColor,
          } = proc;
          return new VolumeProcess({
            processID: pid, name, volume, dominantColor,
          });
        });

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
