const fs = require('fs')
const desktop = require('./desktop.js')
const socket_io = require('socket.io-client')

// The settings for the remote servers
const remoteSettings = JSON.parse(fs.readFileSync('./view-settings.json', 'utf-8'))['remotes']

console.log(remoteSettings)

// Connect to the remote server, just whatever is the first one for now
const client = socket_io('http://' + remoteSettings[0]['ip'] + ':3001')

var socketHandler = function(socket) {
    socket.on('active_programs', function(data, ret) {
        client.emit('active_programs', '', function(retData) {
            ret(retData)
        })
    })
  
    socket.on('audio_device', function(data) {
        client.emit('audio_device', data)

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

        desktop.setVolume(data.program, data.volume)
    })
}

module.exports.socketHandler = socketHandler