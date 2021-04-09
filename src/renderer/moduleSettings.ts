// This should probably be a JSON file, since this is going to be compiled at runtime
// if it's a JSON file, nothing needs to be rebuilt when this changes
const moduleSettings = {
  defaultModule: 'VolumeMixer',
  currentModules: [
    'VolumeMixer',
    'ScreenSettings',
    // 'SmartLights',
  ],
};

export default moduleSettings;
