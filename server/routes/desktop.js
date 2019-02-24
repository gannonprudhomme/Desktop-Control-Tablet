const fs = require('fs')
const FileUtils = require('../fileutils.js')
const Route = require('./route.js')

class Desktop extends Route {
  constructor(settings) {
    super()

    // Turn this into a function?
    this.volumes = {}
    this.volumeData = JSON.parse(fs.readFileSync('./public/volumeData.json', 'utf-8'))
    this.volumeMixerData = JSON.parse(fs.readFileSync('./public/views/modules/volume-mixer.json', 'utf-8'))

    this.settingsData = settings
    this.currentAudioDevice = this.settingsData['audioDevices'][0]

    this.fileUtils = new FileUtils()

    this.moduleSettings = {}
  }

  socketHandler(socket) {
    socket.on('disconnect', function() {
      // console.log('user disconnected desktop')
    })

    socket.on('browser_error', function(data) {
      console.log(data)
    })

    // Send the settings back to the client
    socket.on('settings', (data, ret) => {
      console.log('Sending settings')

      const modSettings = this.getModuleSettings(this.settingsData['currentModules'])

      // TODO: Give this a better name
      const bothSettings = {...this.settingsData, ...modSettings}

      ret(bothSettings)
    })

    // Retrieve the module settings to be used in creating the HTML elements in settings
    // Returns it as a (module.id, module json settings) pair
    socket.on('module_settings', (data, ret) => {
      let moduleSettings;

      const currentModules = settingsData['currentModules']

      for(const mod in currentModules) {
        if(Object.prototype.hasOwnProperty.call(currentModules, mod)) {
          const modData = currentModules[mod] // The module data from view-settings.json
          const settingsFile = modData['settings'] // Get the 

          const json = JSON.parse(fs.readFileSync('./public/views/modules/' + settingsFile))

          const options = {}
          // Set the module's id to be the key, which points to its settings data
          options[modData['id']] = json

          // console.log(options)

          // Concatenate the JSON objects
          moduleSettings = {...moduleSettings, ...options}
        }
      }

      ret(moduleSettings)
    })

    socket.on('get_module_settings', function(data, ret) {
      // Get the JSON settings file for this specific module
      const json = JSON.parse(fs.readFileSync('./public/views/modules/' + data + '.json'))

      ret(json)
    })

    socket.on('volume-mixer-settings', (data, ret) => {
      console.log('Sending volume-mixer-settings')
      ret(this.volumeMixerData)
    })

    socket.on('volume_data', (data, ret) => {
      console.log('Sending volume Data!')
      ret(this.volumes)
    })
  }

  importVolumeData() {
    // Fill the volume map with all of the previous data here
    this.volumeData = FileUtils.loadVolumeData()

    // Iterate over all of the keys(programs) in the json object
    // And add them to the local map
    for(const key in this.volumeData) {
      if(Object.prototype.hasOwnProperty.call(this.volumeData, key)) {
        this.volumes[key] = this.volumeData[key];
      }
    }
  }

  // Combine all of the settings from the module settings file
  // and return them
  getModuleSettings(currentModules) {
    for(const mod in currentModules) {
      if(Object.prototype.hasOwnProperty.call(currentModules, mod)) {
        const modSettings = currentModules[mod]
        const settingsFile = modSettings['settings']

        // If there is a settings file
        if(settingsFile) {
          // Load it
          const json = JSON.parse(fs.readFileSync('./public/views/modules/' + settingsFile))

          // Do i need this to use .this?
          // Concatenate the JSON objects
          this.moduleSettings = {...this.moduleSettings, ...json}
        }
      }
    }

    return this.moduleSettings
  }

  setVolume(program, volume) {
    this.volumes[this.currentAudioDevice][program] = volume

    FileUtils.saveVolumeData(this.volumes)
  }

  setCurrentAudioDevice(device) {
    currentAudioDevice = device
  }
}


module.exports = Desktop
