// var volumes = {"master-volume":0, "spotify.exe": 0, "discord.exe": 0, "rocketleague.exe": 0, "chrome.exe": 0}
var volumes = {}
var settings = {};

var socket = io()

$(document).ready(function() {
  // On launch, load the settings file
  socket.emit('settings', '', function(data) {
    settings = data;

    // Once it's loaded, load the volume data
    getVolumeData()
  })
})

// Prevents weird/unnatural sliding of the document
$(document.body).on("touchmove", function(event) {
    event.preventDefault();
    event.stopPropagation();
});

// Dynamically create(init) the sliders, connecting them to their respective HTML id's
function createSlider(id, programName) {
  // Generate the jQuery UI slider, at the appropriate ID
  $('#' + id + '-slider').slider({
    value: volumes[programName] * 100,
    min: 0,
    max: 100,
    animate: "fast",
    orientation: "horizontal",

    slide: function(e, ui) {
      $('#' + id + '-label').text(ui.value + "%")
      sendVolumeData(programName, ui.value / 100)
    }
  })

  $('#' + id + '-label').text(Math.floor(volumes[programName] * 100) + "%")
}

// Loop and create all of the volume sliders
function setSliders() {
  console.log(settings)
  var volume_mixers = settings['volumeMixers']
  for(var i = 0; i < volume_mixers.length; i++) {
    var mixer = volume_mixers[i];

    createSlider(mixer['id'], mixer['programName'])
  }
}

// Send volume data back to the server
function sendVolumeData(program, volume) {
  var obj = {
    program: program,
    volume: volume,
    time: (new Date()).getTime()
  }

  console.log('sending volume')
  socket.emit('set_volume', obj)
}

function getVolumeData() {
  socket.emit('volume_data', '', function(data) {
    for(var key in data) {
      volumes[key] = data[key];
    }
    
    // After the volume data is loaded, initialize the sliders
    // We wait for this to determine what the default values of the sliders are going to be
    setSliders()
  })
}