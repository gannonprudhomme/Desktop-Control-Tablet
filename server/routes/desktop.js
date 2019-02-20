var fs = require('fs')
var fileUtils = require('../fileutils.js')

var volumes = {};
var volumeData = JSON.parse(fs.readFileSync('./public/volumeData.json', 'utf-8'))
var settingsData = JSON.parse(fs.readFileSync('./view-settings.json'), 'utf-8')
var volumeMixerData = JSON.parse(fs.readFileSync('./public/views/modules/volume-mixer.json', 'utf-8'))

var currentAudioDevice = settingsData['audioDevices'][0]

// Handle socket messages
var socketHandler = function(socket) {
  // var desktop = io.of('/desktop')
  socket.on('disconnect', function() {
    // console.log('user disconnected desktop')
  })


  socket.on('browser_error', function(data) {
    console.log(data)
  })

  // Send the settings back to the client
  socket.on('settings', function(data, ret) {
    console.log('Sending settings')

    settingsData = JSON.parse(fs.readFileSync('./view-settings.json'), 'utf-8')

    var modSettings = getModuleSettings(settingsData['currentModules'])
    
    settingsData = {...settingsData, ...modSettings}

    ret(settingsData)
  })
  
  // Is this unused?
  socket.on('set_settings', function(data) {
    console.log(settings)

    console.log('Updated settings with: ')
    for(var i = 0; i < settings.length; i++) {
      if(settings[i] !== data[i]) {
        console.log(data[i])
      }
    }
  })

  // Retrieve the module settings to be used in creating the HTML elements in settings
  // Returns it as a (module.id, module json settings) pair
  socket.on('module_settings', function(data, ret) {
    var moduleSettings;

    var currentModules = settingsData['currentModules']
    for(var mod in currentModules) {
      var modData = currentModules[mod] // The module data from view-settings.json
      var settingsFile = modData['settings'] // Get the 
  
      var json = JSON.parse(fs.readFileSync('./public/views/modules/' + settingsFile))
  
      var options = {}
      // Set the module's id to be the key, which points to its settings data
      options[modData['id']] = json

      //console.log(options)
      
      // Concatenate the JSON objects
      moduleSettings = {...moduleSettings, ...options}
    }

    //console.log(moduleSettings)

    ret(moduleSettings)
  })

  socket.on('get_module_settings', function(data, ret) {
    // Get the JSON settings file for this specific module
    let json = JSON.parse(fs.readFileSync('./public/views/modules/' + data + '.json'))

    ret(json)
  })

  socket.on('volume-mixer-settings', function(data, ret) {
    console.log('Sending volume-mixer-settings')
    ret(volumeMixerData)
  })

  socket.on('volume_data', function(data, ret) {
    console.log('Sending volume Data!')
    ret(volumes)
  })
}

// Import 
function importVolumeData() {
  // Fill the volume map with all of the previous data here
  volumeData = fileUtils.loadVolumeData()

  // Iterate over all of the keys(programs) in the json object
  // And add them to the local map
  for(var key in volumeData) {
    volumes[key] = volumeData[key];
  }
}

// Combine all of the settings from the module settings file
// and return them
var moduleSettings;
function getModuleSettings(currentModules) {
  for(var mod in currentModules) {
    var modSettings = currentModules[mod]
    var settingsFile = modSettings['settings']

    // If there is a settings file
    if(settingsFile) {
      // Load it
      var json = JSON.parse(fs.readFileSync('./public/views/modules/' + settingsFile))
      
      // Concatenate the JSON objects
      moduleSettings = {...moduleSettings, ...json}
    }
  }
  
  return moduleSettings
}

function setVolume(program, volume) {
  volumes[currentAudioDevice][program] = volume

  fileUtils.saveVolumeData(volumes)
}

function setCurrentAudioDevice(device) {
  currentAudioDevice = device
}

// Settings(and all exports) are references, and thus change as they're updated
module.exports.settings = settingsData
module.exports.socketHandler = socketHandler
module.exports.importVolumeData = importVolumeData
module.exports.getModuleSettings = getModuleSettings
module.exports.setVolume = setVolume
module.exports.setCurrentAudioDevice = setCurrentAudioDevice