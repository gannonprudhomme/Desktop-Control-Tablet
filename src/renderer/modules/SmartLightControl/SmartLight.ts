// these classes are pretty small, so I think it's fine having them in one file
/* eslint-disable max-classes-per-file */

interface SmartLightInit {
  name: string;
  brightness: number;
  connected: boolean; // if it's responded in the last X seconds
  colorTemp?: number;
  hue?: number;
  // rgbCapable: boolean; // if it's capable of rgb
  // syncWithFlux: boolean; // Dunno if we should do this or not
}

export default class SmartLight {
  name: string;
  brightness: number;
  // rgbCapable: boolean; // if it's capable of rgb
  connected: boolean;
  colorTemp?: number;
  hue?: number;

  constructor(init: SmartLightInit) {
    // Should probably ignore most falsy values? maybe not all though
    // definitely don't want empty strings
    if (!init.name) { throw Error(`SmartLight: name is malformed! ${init.name}`); }

    if (!init.brightness || init.brightness < 0 || init.brightness > 100) {
      throw Error(`SmartLight: brightness is malformed! ${init.brightness}`);
    }

    Object.assign(this, init);
  }
}
