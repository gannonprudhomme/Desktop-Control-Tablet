const muted = false; // Retrieve if the user is currently muted or not
const currentView = 'volume-mixer' // ENUM here, volume-mixer, or pc-stats, or pomdo

const socket = require('socket.io-client')('http://localhost:3000')

let settings = {}
let moduleKeys = []

let displayInitialized = false

$(document).ready(function() {
  console.log('Display: Attempting to get settings, connected: ' + socket.connected)
  // Retrieve the settings from the server
  socket.emit('settings', '', function(data) {
    console.log('Display: Retrieved Settings & Initialized!')
    settings = data;
    moduleKeys = settings['modules']

    // Once we've received the settings data, call intialSetup
    hideOtherModules(settings['startModule'])

    // Create all of the bottom-right module switch icons
    for(let i = 0; i < moduleKeys.length; i++) {
      createModuleToggle(moduleKeys[i])
    }

    displayInitialized = true
  })

  window.setInterval(function() {
    if(Object.keys(settings).length > 0) {
      if(!displayInitialized) {
        console.log('Display: Initialized in loop')
        moduleKeys = settings['modules']

        // Once we've received the settings data, call intialSetup
        hideOtherModules(settings['startModule'])

        // Create all of the bottom-right module switch icons
        for(let i = 0; i < moduleKeys.length; i++) {
          createModuleToggle(moduleKeys[i])
        }

        displayInitialized = true
      }
    }
  }, 300)
})

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
  $('#' + id + '-toggle').click(function() {
    hideOtherModules(id)
  })
}

function desktopPut(urlExtension) {
  console.log('sending ' + urlExtension)
  const instance = axios.create({
    baseURL: 'http://192.168.1.78:3000/desktop/' + urlExtension,
    timeout: 3000,
  })

  instance.put('', {}).then(function(response) {

  }).catch(function(error) {
    console.log(error);
  })
}

function hideOtherModules(moduleToShow) {
  for(let i = 0; i < moduleKeys.length; i++) {
    const key = moduleKeys[i]

    if(key != moduleToShow) {
      $('#' + key).hide()
    }
  }

  $('#' + moduleToShow).show()
}

function updateClock() {
  const now = new Date() // current date

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  const time = hours + ':' + minutes + ' ' + ampm;

  // set the content of the element with the ID time to the formatted string
  document.getElementById('time').innerHTML = time;

  // call this function again in 1000ms
  setTimeout(updateClock, 1000);
}

updateClock(); // initial call
