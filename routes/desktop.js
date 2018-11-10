var express = require('express')
var router = express.Router()
var fs = require('fs')
var bodyParser = require('body-parser') // for parsing basic request data?
var commands = require('./commands.js')
var os = require('os-utils')
var fileUtils = require('./fileutils.js')
var path = require('path')

var volumes = {};
var volumeData = JSON.parse(fs.readFileSync('./public/volumeData.json', 'utf-8'))

var settingsData = JSON.parse(fs.readFileSync('./view-settings.json'), 'utf-8')
var moduleSettings = {}

// Handle socket messages
var socketHandler = function(socket) {
  // var desktop = io.of('/desktop')
  socket.on('disconnect', function() {
    // console.log('user disconnected desktop')
  })

  // Send the settings back to the client
  socket.on('settings', function(data, ret) {
    settingsData = JSON.parse(fs.readFileSync('./view-settings.json'), 'utf-8')

    var modSettings = getModuleSettings(settingsData['currentModules'])

    settingsData = {...settingsData, ...modSettings}

    ret(settingsData)
  })

  socket.on('set_settings', function(data) {
    console.log(settings)

    console.log('Updated settings with: ')
    for(var i = 0; i < settings.length; i++) {
      if(settings[i] !== data[i]) {
        console.log(data[i])
      }
    }
  })

  socket.on('module_settings', function(data) {
    var modSettings = {}

  })

  var {exec} = require('child_process')
  socket.on('set_volume', function(data) {
    var now = (new Date()).getTime()
    // console.log('Volume: ' + data.program + ': ' + (data.volume * 100) + ', Delay: ' + (now - data.time) + 'ms')
    commands.saveDelay(now - data.time)

    volumes[data.program] = data.volume;
    
    // Run a command to set the volume for the given program
    commands.setVolume(data.program, data.volume)

    if(settingsData['save-volume-on-change']) {
      fileUtils.saveVolumeData(volumes)
    }
  })
  
  // Send the volume data back to the client
  socket.on('volume_data', function(data, ret) {
    ret(volumes)
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

function importVolumeData() {
  // Fill the volume map with all of the previous data here
  volumeData = fileUtils.loadVolumeData()

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

var moduleSettings;
function getModuleSettings(currentModules) {
  console.log('\ngetModuleSettings()')

  // if(moduleSettings !== null) {
  //   console.log('module settings initialized')
  // } else {
  //   console.log('not intialized')
  // }
  
  for(var mod in currentModules) {
    var modSettings = currentModules[mod]
    var settingsFile = modSettings['settings']

    var json = JSON.parse(fs.readFileSync('./public/views/modules/' + settingsFile))

    moduleSettings = {...moduleSettings, ...json}
  }

  console.log(moduleSettings)

  console.log('\n\n')

  return moduleSettings
}

// Settings(and all exports) are references, and thus change as they're updated
module.exports.settings = settingsData
module.exports.socketHandler = socketHandler
module.exports.importVolumeData = importVolumeData
module.exports.getModuleSettings = getModuleSettings