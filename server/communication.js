const fs = require('fs')
const desktop = require('./desktop.js')
const socket_io = require('socket.io-client')

// The settings for the remote servers
const remoteSettings = JSON.parse(fs.readFileSync('./view-settings.json', 'utf-8'))['remotes']

// Connect to the remote server, just whatever is the first one for now
const client = socket_io('http://' + remoteSettings[0]['ip'] + ':3001')

// TODO: Need to add a timeout, which will in turn notify the rest of the client that the server isn't responding
var socketHandler = function(socket) {
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
function sendKeypress(keys) {
    client.emit('shortcut', keys)
}

module.exports.socketHandler = socketHandler
module.exports.sendKeypress = sendKeypress 