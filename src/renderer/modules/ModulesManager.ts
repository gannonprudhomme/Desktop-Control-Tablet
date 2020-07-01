/**
 * Deals with the loading of all of the modules, default or user created
*/

import moduleSettings from '../moduleSettings';
import ScreenSettingsModule from './ScreenSettings/ScreenSettingsModule';
import VolumeMixerModule from './VolumeMixer/VolumeMixerModule';
import socket from '../framework/SocketHandler';
import SmartLightModule from './SmartLightControl/SmartLightModule';

const availableModules = new Map();
/* ADD NEW MODULES HERE */
availableModules.set('ScreenSettings', new ScreenSettingsModule());
availableModules.set('VolumeMixer', new VolumeMixerModule(socket));
availableModules.set('SmartLights', new SmartLightModule(socket));

// Retrieve the current modules
export const defaultModule = availableModules.get(moduleSettings.defaultModule);

// TODO: Change this to a map
moduleSettings.currentModules.forEach((moduleName: string, index: number) => {
  const mod = availableModules.get(moduleName);

  // set the index so the icons can be sorted to maintain a consistent order
  mod.index = index;
});

// Retrieve all of the respective actual module objects given their names in the settings
export const currentModules = moduleSettings.currentModules.map(
  (moduleName: string) => availableModules.get(moduleName),
);
