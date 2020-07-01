import SmartLight from './SmartLight';
import socket from '../../framework/SocketHandler';

/** Handles the smart light electron communication */
export default class SmartLightSockets {
  socket: SocketIOClient.Socket;

  constructor(sock: SocketIOClient.Socket) {
    this.socket = sock;
  }

  /** Set the color for the given device to something? */
  setColor(): void {
    // How should we handle different types?
    // arrange
    this.socket.emit('stuff', null);
  }

  // This really only needs its name
  setBrightness(smartLight: SmartLight, brightness: number): void {
    this.socket.emit('set_light_brightness', { id: smartLight.name, brightness });
  }

  setColorTemperature(smartLight: SmartLight, temperature: number): void {
    this.socket.emit('set_light_color', { id: smartLight.name, color: temperature });
  }

  setHue(smartLight: SmartLight, hue: number): void {
    this.socket.emit('set_light_hue', { id: smartLight.name, hue });
  }

  // Only really needs its name
  togglePower(smartLight: SmartLight): void {
    this.socket.emit('toggle_light_power', { id: smartLight.name });
  }

  // Generally only called once upon initialization
  // Retrieve all of the current lights from the server
  getAllLights(): Promise<SmartLight[]> {
    return new Promise((resolve, reject) => {
      this.socket.emit('get_all_lights', null, (lightsData: any[]) => {
        if (!lightsData) {
          reject(Error('getAllLights(): Received bad data attempting to get all lights!'));
          return;
        }

        const lights = lightsData.map(
          (lightData): SmartLight => new SmartLight({ ...lightData }),
        );

        resolve(lights);
      });
    });
  }

  // Update info about a single light
  getLightInfo(smartLight: SmartLight): Promise<SmartLight> {
    return new Promise((resolve, reject) => {
      const { name } = smartLight;

      this.socket.emit('get_light_info', { id: name }, (lightData: any): void => {
        if (!lightData) {
          reject(Error(`getLightInfo(): Received bad data attempting to get lights! ${lightData}`));
          return;
        }

        // Need to handle a not responding error from electron
        // Like the light not responding? or the server?

        // do stuff with it
        // first detect what type it is
        // cast it to an enum?
        resolve(new SmartLight({ ...lightData }));
      });
    });
  }
}

export const smartLightSockets = new SmartLightSockets(socket);
