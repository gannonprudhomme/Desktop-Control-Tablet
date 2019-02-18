// var volumes = {"master-volume":0, "spotify.exe": 0, "discord.exe": 0, "rocketleague.exe": 0, "chrome.exe": 0}
var volumeData = {}
var socket = require('socket.io-client')('http://localhost:3000')

var settings = {}
var currentDeviceName = "DAC"
var currentDeviceIndex = 0
var audioDevices = []

$(document).ready(function() {
  // On launch, load the settings file
  console.log('Attempting to get settings')
  socket.emit('settings', '', function(data) {
    settings = data;
    console.log('Retrieved settings')

    // Once it's loaded, load the volume data
    getVolumeData()
    getActivePrograms()

    window.setInterval(function() {
      getActivePrograms()
    
    }, 3000)
  })
})

// Prevents weird/unnatural sliding of the document
$(document.body).on("touchmove", function(event) {
    event.preventDefault();
    event.stopPropagation();
});

$('#audio-device').click(function() {
  currentDeviceIndex = (currentDeviceIndex + 1) % audioDevices.length
  currentDeviceName = audioDevices[currentDeviceIndex]

  console.log(currentDeviceIndex + " " + currentDeviceName)

  socket.emit('audio_device', currentDeviceName)

  //console.log(volumeData[currentDeviceName])

  changeSliderValues(volumeData[currentDeviceName])
})

// Dynamically create(init) the sliders, connecting them to their respective HTML id's
function createSlider(id, programName) {
  console.log('Creating slider ' + id + ' ' + programName)
  // Generate the jQuery UI slider, at the appropriate ID
  $('#' + id + '-slider').slider({
    value: volumeData[currentDeviceName][programName] * 100,
    min: 0,
    max: 100,
    animate: "fast",
    orientation: "horizontal",

    slide: function(e, ui) {
      $('#' + id + '-label').text(ui.value + "%")
      sendVolumeData(programName, ui.value / 100)
      volumeData[currentDeviceName][programName] = ui.value / 100
    }
  })

  $('#' + id + '-label').text(Math.floor(volumeData[currentDeviceName][programName] * 100) + "%")
}

// Loop and create all of the volume sliders
function setSliders() {
  //console.log(settings)
  var volume_mixers = settings['volumeMixers']
  for(var i = 0; i < volume_mixers.length; i++) {
    var mixer = volume_mixers[i];

    createSlider(mixer['id'], mixer['programName'])
  }
}

// Change the slider values when swapping audio outputs
function changeSliderValues() {
  //console.log(settings)
  var volume_mixers = settings['volumeMixers']
  for(var i = 0; i < volume_mixers.length; i++) {
    var mixer = volume_mixers[i];

    $('#' + mixer['id'] + '-slider').slider('value', volumeData[currentDeviceName][mixer['programName']] * 100)
    $('#' + mixer['id'] + '-label').text(parseInt(volumeData[currentDeviceName][mixer['programName']] * 100) + "%")
  }
}

// Send volume data back to the server/
function sendVolumeData(program, volume) {
  var obj = {
    program: program,
    volume: volume,
    time: (new Date()).getTime()
  }

  //console.log('sending volume')
  socket.emit('set_volume', obj)
}

function getVolumeData() {
  console.log('Attempting to retrieve volume data')
  socket.emit('volume_data', '', function(data) {
    var i = 0
    console.log('Retrieved volume data')
    
    for(var key in data) {
      volumeData[key] = data[key];
      
      audioDevices[i] = key
      
      i++
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
    for(var id in data) {
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