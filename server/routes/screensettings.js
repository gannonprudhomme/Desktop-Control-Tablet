const fs = require('fs')
const Route = require('./route.js')

// Need to add a check to see if the client is running on a Raspberry Pi
// const backLight = require('rpi-backlight')

class ScreenSettings extends Route {
  constructor() {
    super()
  }

  socketHandler(socket) {
    socket.on('rpi_get_info', (data, ret) => {
      const retData = {}
      retData['minBrightness'] = 9 // Anything below 9 isn't visible
      retData['maxBrightness'] = backLight.getMaxBrightness()
      retData['brightness'] = backLight.getBrightness()
      retData['power'] = backLight.isPoweredOn()
    })

    socket.on('rpi_set_brightness', (data) => {
      backLight.setBrightness(data)
    })

    // Turn the raspberry pi screen on/off
    socket.on('rpi_set_screen_power', (data) => {
      if(data) {
        backLight.powerOn()
      } else {
        backLight.powerOff()
      }
    })
  }
}

module.exports = ScreenSettings
