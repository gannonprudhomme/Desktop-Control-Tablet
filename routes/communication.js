var client = require('socket.io-client')('http://localhost:3001') // Connection to the Desktop server

var socketHandler = function(socket) {
    socket.on('active_programs', function(data, ret) {
        client.emit('active_programs', '', function(retData) {
            ret(retData)
        })
    })
  
    socket.on('audio_device', function(data) {
        client.emit('audio_device', data)
    })
  
    socket.on('screenshot', function(data) {
        client.emit('screenshot', '')
    })
  
    socket.on('pc_stats', function(data, ret) {
        client.emit('pc_stats', '', function(retData) {
            ret(retData)
        })
    })

    socket.on('set_volume', function(data) {
        client.emit('set_volume', data)

        fileUtils.saveVolumeData(data)
    })
}

module.exports.socketHandler = socketHandler