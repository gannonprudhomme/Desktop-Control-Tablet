var muted = false; // Retrieve if the user is currently muted or not
var currentView = 'volume-mixer' // ENUM here, volume-mixer, or pc-stats, or pomdo
var audioDevice = 'DAC'

var socket = io()

$(document).ready(function() {

  $('#pc-stats').hide()
  $('#timer-control').hide()
})

$('#power-button').click(function() {
  desktopPut('sleep')
})

$('#volume-mixer-toggle').click(function() {
  console.log('mute')

  currentView = 'volume-mixer'
  $('#volume-mixer').show()
  $('#pc-stats').hide()
  $('#timer-control').hide()
})

$('#pc-stats-toggle').click(function() {
  // if(!(currentView === 'pc-stats')) {}

  currentView = 'pc-stats'
  $('#pc-stats').show()
  $('#volume-mixer').hide()
  $('#timer-control').hide()
})

$('#deafen-output').click(function() {
  if(audioDevice == 'DAC') { // Then tell to swap to soundbar
    audioDevice = 'Sound Bar'

  } else {
    audioDevice = 'DAC'
  }

  socket.emit('audio_device', audioDevice)
})

$('#mute-microphone').click(function() {
  var socket = io()
  socket.emit('chat message', 'hello')
})

function getDiscord() {
  instance = axios.create({
    baseURL: 'http://192.168.1.78:3000/discord-api/user',
    timeout: 3000,
    headers: {'X-Custom-Header': 'foobar'}
  })
  instance.get('', {}).then(function(response) {

  }).catch(function(error) {
    console.log(error);
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
