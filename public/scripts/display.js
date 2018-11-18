var muted = false; // Retrieve if the user is currently muted or not
var currentView = 'volume-mixer' // ENUM here, volume-mixer, or pc-stats, or pomdo

var socket = io()

var settings = {}
var moduleKeys = []

$(document).ready(function() {
  // Retrieve the settings from the server
  socket.emit('settings', '', function(data) {
    settings = data;
    moduleKeys = settings['modules']

    // Once we've received the settings data, call intialSetup
    hideOtherModules(settings['startModule'])

    for(var i = 0; i < moduleKeys.length; i++) {
      createModuleToggle(moduleKeys[i])
    }
  })
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
