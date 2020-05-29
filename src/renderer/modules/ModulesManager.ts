/**
 * Deals with the loading of all of the modules, default or user created
*/

import moduleSettings from '../moduleSettings';
import ScreenSettingsModule from './ScreenSettings/ScreenSettingsModule';
import VolumeMixerModule from './VolumeMixer/VolumeMixerModule';
import socket from '../framework/SocketHandler';

const availableModules = new Map();
/* ADD NEW MODULES HERE */
availableModules.set('ScreenSettings', new ScreenSettingsModule());
availableModules.set('VolumeMixer', new VolumeMixerModule(socket));

// Retrieve the current modules
export const defaultModule = availableModules.get(moduleSettings.defaultModule);

const thing = [];

moduleSettings.currentModules.forEach((moduleName: string) => {
  const mod = availableModules.get(moduleName);

  thing.push(mod);
});

// Retrieve all of the respective actual module objects given their names in the settings
export const currentModules = moduleSettings.currentModules.map(
  (moduleName: string) => availableModules.get(moduleName),
);
