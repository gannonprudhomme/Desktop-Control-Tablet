import SmartLight from './SmartLight';

// action type strings
export const INITIALIZE_SMART_LIGHTS = 'INITIALIZE_SMART_LIGHTS';
export const UPDATE_SMART_LIGHT = 'UPDATE_SMART_LIGHT';

// action type interface
export interface InitializeSmartLights {
  type: 'INITIALIZE_SMART_LIGHTS';
  lights: SmartLight[];
}

export interface UpdateSmartLightAction {
  type: 'UPDATE_SMART_LIGHT';
  light: SmartLight;
}

export type SmartLightAction = InitializeSmartLights | UpdateSmartLightAction;

// reducer
export default function smartLights(state = new Map<string, SmartLight>(),
  action: SmartLightAction): Map<string, SmartLight> {
  switch (action.type) {
    case INITIALIZE_SMART_LIGHTS:
      // It's given to us as an array. Convert it to a Map<string, SmartLight>, where the key is
      // its name
      return new Map(
        action.lights.map((light) => [light.name, light] as [string, SmartLight]),
      );
    case UPDATE_SMART_LIGHT: { // We're updating the current state of an existing light
      const light = state.get(action.light.name);

      // Update the state of the light
      const { brightness, colorTemp, connected } = action.light;

      light.connected = connected;

      // We might not have these be initialized if it's not connected?
      light.colorTemp = colorTemp;
      light.brightness = brightness;

      return state;
    }
    default:
      return state;
  }
}
