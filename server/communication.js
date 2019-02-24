const fs = require('fs')
const desktop = require('./routes/desktop.js')
const socketIO = require('socket.io-client')
const Route = require('./routes/route.js')

class Communication extends Route {
  constructor(settings) {
    super()

    // The settings for the remote servers
    this.remoteSettings = settings['remotes']

    // TODO: Make the port configurable
    this.client = socketIO('http://' + remoteSettings[0]['ip'] + ':3001')
  }

  socketHandler(socket) {
    socket.on('active_programs', function(data, ret) {
      client.emit('active_programs', '', function(retData) {
        ret(retData)
      })
    })

    socket.on('audio_device', function(data) {
      client.emit('audio_device', data)

      // Set the currentAudioDevice property in desktop.js to be used for various volume stuff
      desktop.setCurrentAudioDevice(data)
    })

    socket.on('screenshot', function(data) {
      client.emit('screenshot', '')
    })

    socket.on('pc_stats', function(data, ret) {
      // First need to check if the client(windows 10 server) is connected or not
      client.emit('pc_stats', '', function(retData) {
        ret(retData)
      })
    })

    socket.on('set_volume', function(data) {
      client.emit('set_volume', data)

      // Set the volume in the volumes array in desktop.js and save it to the file system
      desktop.setVolume(data.program, data.volume)
    })
  }

  // Send a string of key-presses to the client(windows 10 server)
  sendKeypress(keys) {
    client.emit('shortcut', keys)
  }
}

module.exports = Communication
