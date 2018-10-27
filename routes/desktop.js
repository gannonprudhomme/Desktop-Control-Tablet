var express = require('express')
var router = express.Router()
var fs = require('fs')
var bodyParser = require('body-parser') // for parsing basic request data?

var volumes = {};
var volumeData = JSON.parse(fs.readFileSync('./public/volumeData.json', 'utf-8'))

var socketHandler = function(socket) {
  // var desktop = io.of('/desktop')
  socket.on('disconnect', function() {
    // console.log('user disconnected desktop')
  })

  var {exec} = require('child_process')
  socket.on('set_volume', function(data) {
    var now = (new Date()).getTime()
    console.log('Volume: ' + data.program + ': ' + (data.volume * 100) + ', Delay: ' + (now - data.time) + 'ms')


    exec('nircmd true setappvolume ' + data.program + ' ' + data.volume)
  })

  socket.on('volume_data', function(data, fn) {
    fn(volumeData)
  })

  // return router
}

function saveVolumeData() {
  fs.writeFile('./public/volumeData.json', JSON.stringify(volumeData), function(error) {
    if(error)
      console.log(error)
  })
}

function loadVolumeData() {
  // Fill the volume map with all of the previous data here
  // Doesn't need to be asynchronous
  volumeData = JSON.parse(fs.readFileSync('./public/volumeData.json', 'utf-8'))

  // Iterate over all of the keys(programs) in the json object
  // And add them to the local map
  for(key in volumeData) {
    volumes[key] = volumeData[key];
  }
}

module.exports.socketHandler = socketHandler;
module.exports.loadVolumeData = loadVolumeData
