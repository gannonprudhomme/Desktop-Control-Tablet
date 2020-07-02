// Based off of https://github.com/ToXIc-Dev/flux-tplink-smart-bulbs
const express = require('express')
const router = express.Router()
const fs = require('fs')
const Route = require('./route.js')

const transition = 50

const TPLSmartDevice = require('tplink-lightbulb')
const LifxClient = require('lifx-lan-client').Client;
const lifx = new LifxClient({port: '50505'})

const LIFX_ID = 'lifx';
const TPLINK_ID = 'tp-link';

// A SmartLight
// When we move to typescript, we'll just use the client's implementation of this
class AbstractLight {
  name; // string
  power; // boolean
  object; // internal object
  kelvin; // number
  connected; // boolean. If the light is active and responding

  constructor() {
    // We can assume that if we're initializing and object, it's connected & responding
    this.connected = true;

    this.lastHueSet = new Date().getTime();
    this.lastTempSet = new Date().getTime();
    this.lastBrightnessSet = new Date().getTime();
  }

  /** Converts the object into a form the frontend can use */
  serialize() {
    return {
      name: this.name,
      brightness: this.brightness,
      connected: this.connected,
    };
  }

  /** Returns a promise with a reference to this object */
  refreshState() {
  }
  
  /**
   * 
   * @param {number} brightness 
   */
  setBrightness(brightness) { }

  // Should this be setPower?
  togglePower() { }
}

class RGBLight extends AbstractLight {
  // All are numbers
  hue;
  saturation;
  temperature;

  serialize() {
    const superSerial = super.serialize();

    return {
      ...superSerial,
      rgbCapable: true,
      colorTemp: this.temperature,
      hue: this.hue,
      saturation: this.saturation,
    }
  }

  setTemperature(kelvin) { }

  setHue(hue) { }
}

class LifxLight extends RGBLight {
  constructor(object) {
    super();
    this.object = object;

    this.overloadCutoff = 50; // Ignore requests that are 50ms between eachother
  }

  serialize() {
    const superSerial = super.serialize();

    return {
      ...superSerial,
      type: LIFX_ID,
    };
  }

  refreshState() {
    const self = this;
    return new Promise((resolve, reject) => {
      this.object.getState((err, data) => {
        if(err) {
          reject(err)
          return
        }

        if(!data) {
          reject(Error("Data is invalid!"));
          return;
        }

        const { color, label } = data;

        if (!color) {
          reject(Error("Color is invalid!"))
          return;
        }

        const { hue, saturation, brightness, kelvin } = color;

        self.name = label;
        self.hue = hue;
        self.saturation = saturation;
        self.brightness = brightness;
        self.temperature = kelvin;

        resolve(self);
      });
    });
  }

  setBrightness(brightness) { // This could be a computer property?
    const now = new Date().getTime();

    if (now - this.lastBrightnessSet >= this.overloadCutoff) {
      this.lastBrightnessSet = now;

      console.log(`Setting brightness for light ${this.name} to ${brightness}`)
      this.brightness = brightness;
      this.setColor();
    } else {
      console.log('Skipping setting brightness')
    }
  }

  setTemperature(temperature) {
    const now = new Date().getTime();

    if (now - this.lastTempSet >= this.overloadCutoff) {
      this.lastTempSet = now;

      // Set hue and saturation to 0 so it only pays attention to temperature
      this.hue = 0;
      this.saturation = 0;
      this.temperature = temperature;

      this.setColor();
      console.log(`Setting temperature for light ${this.name} to ${temperature}`)
    } else {
      console.log('Skipping setting temperature');
    }
  }

  setHue(hue) {
    const now = new Date().getTime();

    if (now - this.lastHueSet >= this.overloadCutoff) {
      this.lastHueSet = now;

      this.hue = hue;
      this.saturation = 100;

      this.setColor();
      console.log(`Setting hue for light ${this.name} to ${hue}`)
    } else {
      console.log(`Skipping setting hue`)
    }
  }

  /*
  setColor(hue = this.hue, saturation = this.saturation, brightness = this.brightness, temperature = this.temperature) {
    this.object.color(hue, saturation, brightness, temperature, 0, 
                      (error) => {
        console.log(`Set thing to ${hue} ${saturation} ${this.brightness} ${this.temperature}`);
  */

  // Private
  setColor() {
    this.object.color(this.hue, this.saturation, this.brightness, this.temperature, 0, 
                      (error) => {
        if (error) {
          console.log(error);
          this.connected = false; // Maybe?
        }
    });
  }

  togglePower() {
    this.power = !this.power;

    if (this.power) {
      this.object.on();
    } else {
      this.object.off();
    }
  }
}

class SmartLight extends Route {
  constructor(moduleSettings) {
    super()
    this.moduleSettings = JSON.parse(fs.readFileSync('./public/views/modules/light-control.json'))

    // Delay for the light state change transition
    this.transition = 50
    this.lightsData = {}
    this.lightsSettings = this.moduleSettings['lights']
    this.lightsStore = new Map(); // [String, Light]

    this.router = express.Router()
    this.handleRoute()

    lifx.init();
    this.lifxHandler();
  }

  /**
   * 
   * @param {{ name: string }} data
   * @param {*} ret Callback function to return the data
   *  return the serialized AbstractLight
   */
  getLightInfo(data, ret) {
    const { name } = data;

    if (!name) {
      console.log(`getLightInfo(): Received invalid name!`);
      ret(null);
      return;
    }

    const smartLight = this.lightsStore.get(name);

    if (!smartLight) {
      console.log(`getLightInfo(): Could not find light: ${name}`);
      ret(null);
      return;
    }

    smartLight.refreshState().then((refreshedLight) => {
      // refreshLight shouldn't ever be invalid
      ret(refreshedLight.serialize());
    });
  }

  getAllLights(data, ret) {
    const retData = [];

    this.lightsStore.forEach((light) => {
      retData.push(light.serialize());
    });

    ret(retData);

    /*
    // Retrieve all lights we have for LIFX
    const lifxLights = lifx.lights(); // I think this is O(1) & it's syncrhonous?
    // TODO: I'm going to have to manually track the TPLink bulbs since the library doesn't do it for me
    const tpLinkLights = [];
    let retData = [];
    let count = 0;
    const total = lifxLights.length + tpLinkLights.length;

    await lifxLights.forEach(async (light) => {
      console.log('attempting to get state!')
      await light.getState((err, data) => {
        console.log('retrieved state!');
        if (err) {
          console.log(err);
        }

        const { color, label } = data;
        const { brightness, kelvin, hue } = color;

        const retObj = { 
          name: label,
          colorTemp: kelvin,
          brightness,
          hue,
          rgbCapable: true,
        }

        console.log(retObj);

        retData.push(retObj);
        count += 1
      })
    });

    function waitForAllLights(finish) {
      const waitTime = 500;
      if (count === total) {
        console.log('done waiting')
        ret(retData);
      } else {
        console.log('waiting');
        setTimeout(waitForAllLights, waitTime)
      }
    }

    waitForAllLights();
    */
  }

  /**
   * 
   * @param {{ name: string, brightness: number }} data 
   */
  setBrightness(data) {
    const { name, brightness } = data;

    if (!name) {
      console.log(`setBrightness(): Received invalid name!`);
      return;
    }

    if (!brightness) {
      console.log(`setBrightness(): Received invalid brightness!`);
      return;
    }

    const smartLight = this.lightsStore.get(name);

    if (!smartLight) {
      console.log(`setBrightness(): Could not find light: ${name}`);
      return;
    }

    smartLight.setBrightness(brightness);
  }

  /**
   * 
   * @param {{ name: string, temperature: number }} data 
   */
  setTemperature(data) {
    const { name, temperature } = data;

    if (!name) {
      console.log(`setTemperature(): Received invalid name!`);
      return;
    }

    if (!temperature) {
      console.log(`setTemperature(): Received invalid temperature!`);
      return;
    }

    const smartLight = this.lightsStore.get(name);

    if (!smartLight) {
      console.log(`setTemperature(): Could not find light: ${name}`);
      return;
    }

    smartLight.setTemperature(temperature);
  }

  togglePower(data) {
    const { name } = data;

    if (!name) {
      console.log(`togglePower(): Received invalid name!`);
      return;
    }

    const smartLight = this.lightsStore.get(name);

    if (!smartLight) {
      console.log(`togglePower(): Could not find light: ${name}`);
      return
    }

    smartLight.togglePower();
  }

  /**
   * 
   * @param {{ name: string, hue: number }} data 
   */
  setHue(data) {
    const { name, hue } = data;

    if (!name) {
      console.log(`setHue(): Received invalid name!`);
      return;
    }

    if (!hue) {
      console.log(`setHue(): Received invalid temperature!`);
      return;
    }

    const smartLight = this.lightsStore.get(name);

    if (!smartLight) {
      console.log(`setHue(): Could not find light: ${name}`);
      return;
    }

    smartLight.setHue(hue);
  }

  socketHandler(socket) {
    socket.on('get_light_info', (data, ret) => {
      this.getLightInfo(data, ret);
    })

    socket.on('get_all_lights', (data, ret) => {
      this.getAllLights(data, ret);
    })

    socket.on('set_light_brightness', (data) => {
      this.setBrightness(data);
    })

    // Set the color temperature (in kelvin)
    socket.on('set_light_color', (data) => {
      this.setTemperature(data);
    })

    socket.on('toggle_light_power', (data) => {
      this.togglePower(data);
    })

    socket.on('set_light_hue', (data) => {
      this.setHue(data);
    });
  }

  lifxHandler() {
    const self = this;

    lifx.on('light-new', (lightObj) => {
      const smartLight = new LifxLight(lightObj);

      smartLight.refreshState().then((refreshedLight) => {
        self.lightsStore.set(refreshedLight.name, refreshedLight);
      });
    })
  }

  handleRoute() {
    // Handle flux changes to update the lightbulb
    this.router.post('/flux', (req, res) => {
      const temperature = parseInt(req.query['ct'], 10);

      // Iterate through all of the lights that are RGB Capable
      this.lightsStore.forEach((light) => {
        if (light instanceof RGBLight) {
          light.setTemperature(temperature)
        }
      });

      // Send the response back to f.lux? Not sure if this is necessary
      res.end(JSON.stringify(req.query));
    })
  }
}

module.exports = SmartLight
