import * as React from 'react';
import { ServerModule } from '../../types/Module';
import VolumeMixer from './VolumeMixer';
import volumeProcesses from './reducer';

const icon = require('../../../../public/assets/levels-adjustment.png');

export default class VolumeMixerModule implements ServerModule {
  component: React.FC;
  icon: string;
  name: string;
  socket: SocketIOClient.Socket;
  reducer: Function;
  serverRequired: boolean;
  index: number;

  constructor(socket: SocketIOClient.Socket) {
    this.name = 'VolumeMixer';
    this.socket = socket;
    this.component = VolumeMixer;
    this.icon = icon.default;
    this.reducer = volumeProcesses;
    this.serverRequired = true;
  }
}
