const fs = require('fs')
const Route = require('./route.js')

let backLight = '';
if(isPi()) {
  // Need to add a check to see if the client is running on a Raspberry Pi
  backLight = require('rpi-backlight')
}

class ScreenSettings extends Route {
  constructor() {
    super()
  }

  socketHandler(socket) {
    socket.on('rpi_get_info', (data, ret) => {
      // TODO: Need to return something if there is an error
      const retData = {}
      if(isPi()) {
        // Retrieve all of the rpi screen information
        backLight.getMaxBrightness().then((maxBrightness) => {
          retData['minBrightness'] = 9
          retData['maxBrightness'] = maxBrightness

          return backLight.getBrightness()
        }).catch((err) => {
          console.log(err)
        }).then((brightness) => {
          retData['brightness'] = brightness

          return backLight.isPoweredOn()
        }).catch((err) => {
          console.log(err)
        }).then((isPowered) => {
          retData['power'] = isPowered

          console.log('ScreenSettings: Returning rpi data!')
          ret(retData)
        }).catch((err) => {
          console.log(err)
        })
      } else {
        const retData = {
          brightness: 0,
          power: false,
          minBrightness: 8, // The screen isn't visible anything past 9%
          maxBrightness: 100,
        }

        ret(retData)
      }
    })

    socket.on('rpi_set_brightness', (data) => {
      if(isPi()) {
        backLight.setBrightness(data)
      }
    })

    // Turn the raspberry pi screen on/off
    socket.on('rpi_set_screen_power', (data) => {
      if(isPi()) {
        if(data) {
          backLight.powerOn()
        } else {
          backLight.powerOff()
        }
      }
    })
  }
}

function isPi() {
  // For now, people probably won't be building on Linux, so we can assume it's the Pi
  return process.platform === 'linux'
}

module.exports = ScreenSettings
