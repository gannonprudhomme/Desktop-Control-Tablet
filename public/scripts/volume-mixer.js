// var volumes = {"master-volume":0, "spotify.exe": 0, "discord.exe": 0, "rocketleague.exe": 0, "chrome.exe": 0}
let volumeData = {}

// var settings = {}
let currentDeviceName = "DAC"
let currentDeviceIndex = 0
let audioDevices = []

// If we've initialized everything or not
let isInitialized = false

$(document).ready(function() {
  // On launch, load the settings file

  // Try to retrieve the settings every second until we're successful
  window.setInterval(function() {
    if(Object.keys(settings).length === 0) { // If the settings data is loaded
      console.log('Volume: Attempting to get settings, connected: ' + socket.connected)
      socket.emit('settings', '', function(data) {
        console.log('Volume: Retrieved settings')

        settings = data
        initialize()
      })
    } else {
      // Settings data is loaded, check if we need to initialize the view
      if(!isInitialized) {
        initialize()
      }
    }
  }, 1000)
})

function initialize() {
  // Once it's loaded, load the volume data
  getVolumeData()
  getActivePrograms()

  window.setInterval(function() {
    getActivePrograms()
  }, 3000)

  isInitialized = true
  console.log('Volume: Initialized')
}

// Prevents weird/unnatural sliding of the document
$(document.body).on('touchmove', function(event) {
  event.preventDefault();
  event.stopPropagation();
});

$('#audio-device').click(function() {
  currentDeviceIndex = (currentDeviceIndex + 1) % audioDevices.length
  currentDeviceName = audioDevices[currentDeviceIndex]

  console.log(currentDeviceIndex + ' ' + currentDeviceName)

  socket.emit('audio_device', currentDeviceName)

  // console.log(volumeData[currentDeviceName])

  changeSliderValues(volumeData[currentDeviceName])
})

// Dynamically create(init) the sliders, connecting them to their respective HTML id's
function createSlider(id, programName) {
  // console.log('Creating slider ' + id + ' ' + programName)
  // Generate the jQuery UI slider, at the appropriate ID
  $('#' + id + '-slider').slider({
    value: volumeData[currentDeviceName][programName] * 100,
    min: 0,
    max: 100,
    animate: 'fast',
    orientation: 'horizontal',

    slide: function(e, ui) {
      $('#' + id + '-label').text(ui.value + '%')
      sendVolumeData(programName, ui.value / 100)
      volumeData[currentDeviceName][programName] = ui.value / 100
    },
  })

  $('#' + id + '-label').text(Math.floor(volumeData[currentDeviceName][programName] * 100) + '%')
}

// Loop and create all of the volume sliders
function setSliders() {
  // console.log(settings)
  const volumeMixers = settings['volumeMixers']
  for(const i = 0; i < volumeMixers.length; i++) {
    const mixer = volume_mixers[i];

    createSlider(mixer['id'], mixer['programName'])
  }
}

// Change the slider values when swapping audio outputs
function changeSliderValues() {
  // console.log(settings)
  const volumeMixers = settings['volumeMixers']
  for(const i = 0; i < volumeMixers.length; i++) {
    const mixer = volumeMixers[i];

    $('#' + mixer['id'] + '-slider').slider('value', volumeData[currentDeviceName][mixer['programName']] * 100)
    $('#' + mixer['id'] + '-label').text(parseInt(volumeData[currentDeviceName][mixer['programName']] * 100) + '%')
  }
}

// Send volume data back to the server/
function sendVolumeData(program, volume) {
  const obj = {
    program: program,
    volume: volume,
    time: (new Date()).getTime(),
  }

  // console.log('sending volume')
  socket.emit('set_volume', obj)
}

function getVolumeData() {
  // console.log('Volume: Attempting to retrieve volume data')
  socket.emit('volume_data', '', function(data) {
    const i = 0
    console.log('Retrieved volume data')

    for(const key in data) {
      if(Object.prototype.hasOwnProperty.call(data, key)) {
        volumeData[key] = data[key];
        audioDevices[i] = key

        i++
      }
    }

    console.log(volumeData)
    currentDeviceName = audioDevices[currentDeviceIndex]

    // After the volume data is loaded, initialize the sliders
    // We wait for this to determine what the default values of the sliders are going to be
    setSliders()
  })
}

function getActivePrograms() {
  // Attempt to retrieve the list of active programs
  socket.emit('active_programs', '', function(data) {
    for(const id in data) {
      // If the program is active
      if(data[id]) {
        // Display it
        $('#' + id + '-container').show()
      } else { // Otherwise, hide it
        $('#' + id + '-container').hide()
      }
    }
  })
}
