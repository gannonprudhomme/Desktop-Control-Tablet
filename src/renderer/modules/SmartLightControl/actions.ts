import SmartLight from './SmartLight';
import {
  UpdateSmartLightAction, InitializeSmartLights, UPDATE_SMART_LIGHT, INITIALIZE_SMART_LIGHTS,
} from './reducer';

/** Update the values for a given smart light */
export function updateSmartLight(light: SmartLight): UpdateSmartLightAction {
  return {
    type: UPDATE_SMART_LIGHT,
    light,
  };
}

/** Initialize the SmartLights array for the first time. Should only be called once upon init */
export function initializeSmartLights(lights: SmartLight[]): InitializeSmartLights {
  return {
    type: INITIALIZE_SMART_LIGHTS,
    lights,
  };
}
