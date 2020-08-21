import * as React from 'react';
import { ServerModule } from '../../types/Module';
import SmartLightControl from './SmartLightControl';
import smartLights from './reducer';

const icon = require('../../../../public/assets/bulb.png');

export default class SmartLightModule implements ServerModule {
  component: React.FC;
  icon: string;
  name: string;
  socket: SocketIOClient.Socket;
  reducer: Function;
  serverRequired: boolean;
  index: number;

  constructor(socket: SocketIOClient.Socket) {
    this.name = 'SmartLights';
    this.socket = socket;
    this.component = SmartLightControl;
    this.icon = icon.default;
    this.reducer = smartLights;
    this.serverRequired = false;
  }
}
