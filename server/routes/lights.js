// Based off of https://github.com/ToXIc-Dev/flux-tplink-smart-bulbs
const express = require('express')
const router = express.Router()
const fs = require('fs')
const Route = require('./route.js')

const transition = 50

const TPLSmartDevice = require('tplink-lightbulb')
const LifxClient = require('node-lifx').Client
const lifx = new LifxClient({port: '50505'})

class SmartLight extends Route {
  constructor(moduleSettings) {
    super()
    this.moduleSettings = JSON.parse(fs.readFileSync('./public/views/modules/light-control.json'))

    // Delay for the light state change transition
    this.transition = 50
    this.lightsData = {}
    this.lightsSettings = this.moduleSettings['lights']

    this.router = express.Router()
    this.handleRoute()

    this.initLights()
  }

  socketHandler(socket) {
    let _lightWasResponding = false // TODO Review the use/necessity of this

    socket.on('get_light_info', (data, ret) => {
      // Retrieve the light info from the bulb itself
      const lightID = data['id']
      let lightResponding = false

      // Get the type of the bulb
      const type = this.lightsData[lightID]['type']

      if(type == 'tp-link') {
        const bulb = this.lightsData[lightID]['object'] // Load the respective TPLSmartDevice object

        bulb.info().then((info) => {
          if(!_lightWasResponding) {
            // console.log('Light now responding!')
          }

          _lightWasResponding = true
          lightResponding = true

          let lightState = info['light_state']
          this.lightsData[lightID]['power'] = lightState['on_off']

          // If the light isn't on
          if(!this.lightsData[lightID]['power']) {
            // Then the light data is going to be located in data.light_state.dft_on_state
            // instead of data.light_state
            lightState = light_state['dft_on_state']
          }

          // Update the light data dictionary
          this.lightsData[lightID]['brightness'] = lightState['brightness']
          this.lightsData[lightID]['color_temp'] = lightState['color_temp']
          this.lightsData[lightID]['responding'] = lightResponding // which will always be set to true at this point

          // Create the dictionary to be returned the client
          // We create this separately, as we don't need to send back the full data(like light type and its object)
          const retData = {
            'brightness': lightState['brightness'],
            'color_temp': lightState['color_temp'],
            'responding': lightResponding,
          }

          // Don't wanna send the light object or anything
          ret(retData)
        }).catch((error) => {
          console.log(error)
        })
      } else if(type == 'lifx') {
        if(this.lightsData[lightID]['object'] != null) {
          // Or iterate through all of the lights
          this.getLifxInfo(this.lightsData[lightID]['object'], lightID).then((data) => {
            const retData = {
              'hue': data['hue'],
              'saturation': data['saturation'],
              'brightness': data['brightness'],
              'color_temp': data['color_temp'],
              'responding': lightResponding,
            }

            ret(retData)
          }).catch((error) => {
            if(error.message == 'No LIFX response in time') {
              // console.log('LIFX Bulb not responding')
            } else {
              console.log(error)
            }
          })
        } else { // LIFX object is null for this light
        }
      } else { // Unknown light type
      }
    })

    socket.on('set_light_brightness', (data) => {
      // console.log('Setting brightness to ' + data)

      const now = (new Date()).getTime()

      const lightID = data['id']
      const brightness= data['brightness']

      // Set the new brightness in the lightsData dictionary for this object
      this.lightsData[lightID]['brightness'] = brightness

      const lightObj = this.lightsData[lightID]['object']

      // If the light object exists
      if(lightObj) {
        // Get the type of the bulb
        const type = this.lightsData[lightID]['type']

        if(type == 'tp-link') {
          lightObj.power(this.lightsData[lightID]['power'], transition, {brightness: data}).then((status) => {
            const delay = (new Date()).getTime() - now
            // console.log('Brightness delay: ' + delay)
          })
        } else if(type == 'lifx') {
          const lifxData = this.lightsData[lightID]

          lightObj.color(lifxData['hue'], lifxData['saturation'], brightness, lifxData['color_temp'])
        }
      }
    })

    socket.on('set_light_color', (data) => {
      const lightID = data['id']
      const colorTemp = data['color']

      // Get the according light object
      const lightObj = this.lightsData[lightID]['object']

      // Get the type of the bulb
      const type = this.lightsData[lightID]['type']
      if(type == 'tp-link') {
        lightObj.power(this.lightsData[lightID]['power'], transition, {colorTemp: colorTemp}).then((status) => {
          // console.log(status)
        })
      } else if(type == 'lifx') {
        const lifxData = this.lightsData[lightID]

        lightObj.color(lifxData['hue'], lifxData['saturation'], lifxData['brightness'], colorTemp)
      }
    })

    socket.on('toggle_light_power', (data) => {
      const lightID = data['id']

      this.lightsData[lightID]['power'] = !this.lightData[lightID]['power']

      console.log('Changing light power to: ' + lightData['power'])

      // Get the according light object
      const lightObj = this.lightsData[lightID]['object']
      if(lightObj == null) {
        // Error
      }

      // Get the type of this bulb
      const type = this.lightsData[lightID]['type']
      if(type == 'tp-link') {
        bulb.power(this.lightsData['power']).then((status) => {
          // console.log(status)
        })
      } else if(type == 'lifx') {
        lightObj.on()
      }
    })
  }

  initLights() {
    // These needs to be loaded in dynamically
    for(const i in this.lightsSettings) {
      if(Object.prototype.hasOwnProperty.call(this.lightsSettings, i)) {
        const light =this.lightsSettings[i]
        const id = light['id']

        this.lightsData[id] = {
          'type': light['type'], // We need the type to know how to handle a light given its ID
          // 'ip': light['ip'], // We need the IP for matching LIFX bulbs
          'power': false,
          'brightness': 0,
          'color_temp': light['minColor'],
        }

        if(light['type'] == 'tp-link') {
          // Initialize the TP-Link bulb object
          const bulb = new TPLSmartDevice(light['ip'])

          // And set it as an object in lightsData
          this.lightsData[id]['object'] = bulb
          console.log(this.lightsData)
          // Get its current status
          bulb.info().then((info) => {
            const lightState = info['light_state']

            this.lightsData[id]['power'] = lightState['on_off']
            this.lightsData[id]['brightness'] = lightState['brightness']
            this.lightsData[id]['color_temp'] = lightState['color_temp']
          }).catch((error) => {
            console.log(error)
          })
        } else if(light['type'] == 'lifx') {
          // Set temporary hue and saturation, we'll load its data outside of this for-loop
          this.lightsData[id]['hue'] = 0
          this.lightsData[id]['saturation'] = 0
        }
      }
    }

    // On initialization of a new light
    lifx.on('light-new', (light) => {
      let lightID;
      const lightIP = light.address
      // Check which light this is
      for(const i in this.lightsSettings) {
        if(Object.prototype.hasOwnProperty.call(this.lightsSettings, i)) {
          const lightSetting = this.lightsSettings[i]

          // If this light has the IP for the initialized LIFX light
          if(lightIP == lightSetting['ip']) {
            lightID = lightSetting['id']
            break // End the for loop, we've found the according light
          }
        }
      }

      // If we found the light
      if(lightID != null) {
        // Set the according light object
        this.lightsData[lightID]['object'] = light

        console.log(this.lightsData)

        // Load its data
        this.getLifxInfo(light, lightID).then((lightData) => {

        }).catch((error) => {
          console.log(error)
        })
      } else { // Didn't find the light
        console.log('LIGHT-CONTROL ERROR, Couldnt find LIFX light with IP: ' + lightIP)
      }
    })

    console.log('LIFX init!')
    lifx.init()
  }


  getLifxInfo(lightObject, lightID) {
    return new Promise((resolve, reject) => {
      // Error checking
      if(lightObject == null) {
        reject(Error('lightObject is null'))
        return
      }

      if(lightID == null) {
        reject(Error('lightID is null'))
        return
      }

      lightObject.getState((err, data) => {
        if(err) {
          // console.log(err) // This error should be handled elsewhere
          reject(err)
          return
        }


        const colorData = data['color']

        this.lightsData[lightID]['hue'] = colorData['hue']
        this.lightsData[lightID]['saturation'] = colorData['saturation']
        this.lightsData[lightID]['brightness'] = colorData['brightness']
        this.lightsData[lightID]['color_temp'] = colorData['kelvin']

        // Set if the light is on or not
        this.lightsData[lightID]['power'] = (data['power'] == 1)

        resolve(this.lightsData[lightID])
      })
    })
  }

  // Socket route for retrieving info about the light
  getLightInfo(data, ret) {
  }

  handleRoute() {
    // Handle flux changes to update the lightbulb
    this.router.post('/flux', (req, res) => {
      /*
      // Parse the data from f.lux
      var temp = parseInt(req.query['ct'], 10);

      // Clamp the temperature to the range of the TPLink bulb
      var ctmp;
      if (temp < module_settings['minColor']) {
          ctmp = module_settings['minColor'];

      } else if (temp > module_settings['maxColor']) {
          ctmp = module_settings['maxColor'];

      } else {
          ctmp = temp;
      }

      //console.log('Changing Light to temperature ' + ctmp + 'k')

      // Iterate through all of the bulbs and update them + their respective data

      // Create the bulb object
      bulb = new TPLSmartDevice(bip);

      lightData['color_temp'] = ctmp

      // Transition period of 500ms
      bulb.power(lightData['power'], 500, { color_temp: ctmp })
          .then(status => {
              //console.log(status)
          })
          .catch(err => console.error(err))
      */

      // Send the response back to f.lux? Not sure if this is necessary
      res.end(JSON.stringify(req.query));
    })
  }
}

module.exports = SmartLight
