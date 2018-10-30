var express = require('express')
var router = express.Router()
var fs = require('fs')
var bodyParser = require('body-parser') // for parsing basic request data?
var commands = require('./commands.js')
var os = require('os-utils')

var volumes = {};
var volumeData = JSON.parse(fs.readFileSync('./public/volumeData.json', 'utf-8'))

// Handle socket messages
var socketHandler = function(socket) {
  // var desktop = io.of('/desktop')
  socket.on('disconnect', function() {
    // console.log('user disconnected desktop')
  })

  var {exec} = require('child_process')
  socket.on('set_volume', function(data) {
    var now = (new Date()).getTime()
    console.log('Volume: ' + data.program + ': ' + (data.volume * 100) + ', Delay: ' + (now - data.time) + 'ms')
    commands.saveDelay(now - data.time)

    exec('nircmd true setappvolume ' + data.program + ' ' + data.volume)
  })

  // Send the volume data back to the client
  socket.on('volume_data', function(data, fn) {
    fn(volumeData)
  })

  // Change the current audio device
  socket.on('audio_device', function(data) {
    console.log('audio device ' + data)
    commands.changeAudioOutput(data)
  })

  socket.on('screenshot', function(data) {
    console.log('screenshot!')
    commands.sendKeypress('ctrl+printscreen')
  })

  // Send the current pc performance stats back to the client
  socket.on('pc_stats', function(data, ret) {
    var data = {  }

    // Calculate the current cpu usage over the next minute
    os.cpuUsage(function(val) {
      data.cpuUsage = val
    })

    // Calculate the current free usage over the next minute
    // Callback should always call after os.cpuUsage
    os.cpuFree(function(val) {
      data.cpuFree = val

      data.totalMemory = os.totalmem()
      data.usedMemory = data.totalMemory - os.freemem()

      // Send the pc usage data back to the client
      // console.log(data)
      ret(data)
    })
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

function getPerformanceUsage() {
  var data = {}

  os.cpuUsage(function(val) {
    data.cpuUsage = val;


  })
}

module.exports.socketHandler = socketHandler;
module.exports.loadVolumeData = loadVolumeData
