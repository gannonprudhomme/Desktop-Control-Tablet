var muted = false; // Retrieve if the user is currently muted or not
var currentView = 'volume-mixer' // ENUM here, volume-mixer, or pc-stats, or pomdo

var socket = require('socket.io-client')('http://localhost:3000')

var settings = {}
var moduleKeys = []

var isInitialized = false

$(document).ready(function() {// Try to retrieve the settings every second until we're successful
  window.setInterval(function() {
    if(Object.keys(settings).length === 0) { // If the settings data is loaded
      console.log('Display: Attempting to get settings')
      socket.emit('settings', '', function(data) {
        console.log('Display: Retrieved settings')

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
    moduleKeys = settings['modules']

    // Once we've received the settings data, call intialSetup
    hideOtherModules(settings['startModule'])

    for(var i = 0; i < moduleKeys.length; i++) {
      createModuleToggle(moduleKeys[i])
    }

    console.log("Display: Initialized!")
}

$('#power-button').click(function() {
  desktopPut('sleep')
})

$('#mute-microphone').click(function() {
  socket.emit('discord', 'mute')
})

$('#screenshot').click(function() {
  socket.emit('screenshot', '')
})

// Generate the click action-listener for the toggle-buttons to show the according module
function createModuleToggle(id) {
  $('#' + id + "-toggle").click(function() {
    hideOtherModules(id)
  })
}

function desktopPut(url_extension) {
  console.log('sending ' + url_extension)
  var instance = axios.create({
    baseURL: 'http://192.168.1.78:3000/desktop/' + url_extension,
    timeout: 3000
  })

  instance.put('', {}).then(function(response) {

  }).catch(function(error) {
    console.log(error);
  })
}

function hideOtherModules(moduleToShow) {
  for(var i = 0; i < moduleKeys.length; i++) {
    var key = moduleKeys[i]
    
    if(key != moduleToShow) {
      $('#' + key).hide()
    }
  }

  $('#' + moduleToShow).show()
}

function updateClock() {
  var now = new Date() // current date

  var hours = now.getHours();
  var minutes = now.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var time = hours + ':' + minutes + ' ' + ampm;

  // set the content of the element with the ID time to the formatted string
  document.getElementById('time').innerHTML = time;

  // call this function again in 1000ms
  setTimeout(updateClock, 1000);
}

updateClock(); // initial call
