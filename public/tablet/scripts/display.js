var muted = false; // Retrieve if the user is currently muted or not
var playing = false // Retrieve the current state of playback from Spotify on launch
var current_track = {} // Dictionary/JSON object for the currently played song. Contains track name, album name, artist, and album image link
var lastPlaybackPress = 0

var mixerHidden = false
var currentView = 'volume-mixer' // ENUM here, volume-mixer, or pc-stats, or pomdo

$(document).ready(function() {
  // Load the playback info from spotify, including track info
  getPlaybackInfo()

  $('#pc-stats').hide()
  $('#timer-control').hide()
})

// Check for playback changes every 2 seconds
window.setInterval(function() {
  getPlaybackInfo()

}, 1000)

$('#power-button').click(function() {
  desktopPut('sleep')
})

$("#play-pause").click(function() {
  lastPlaybackPress = (new Date()).getTime();

  if(playing) {
    playing = false;

    // Swap to the play image
    $('#play-pause').attr('src', '/public/assets/play.png')

    sendPlayback('pause', '')
  } else {
    playing = true

    // Swap to the pause image
    $('#play-pause').attr('src', '/public/assets/pause.png')

    sendPlayback('play', '')
  }
})

$('#previous-song').click(function() {
  sendPlaybackCommand('previous')
})

$('#next-song').click(function() {
  sendPlaybackCommand('next')
})

$('#volume-mixer-toggle').click(function() {
  console.log('mute')

  if(mixerHidden) {
    mixerHidden = false
    $('#volume-mixer').show()
    $('#pc-stats').hide()
    $('#timer-control').hide()
  } else {
    mixerHidden = true
    $('#volume-mixer').hide()
  }

  getDiscord();
})

$('#pc-stats-toggle').click(function() {
  if(!(currentView === 'pc-stats')) {
    $('#pc-stats').show()
    $('#volume-mixer').hide()
    $('#timer-control').hide()
  }
})

$('#deafen-output').click(function() {
  getDiscord();
})

$('#mute-microphone').click(function() {
  var socket = io()
  socket.emit('chat message', 'hello')
})

function sendPlayback(type, option) {
  var instance;
  if(type === 'pause') {

    instance = axios.create({
      baseURL: 'http://192.168.1.78:3000/spotify-api/pause',
      timeout: 3000,
      headers: {'timeSent': (new Date()).getTime() }
    })
  } else if(type === 'play') {
    var instance = axios.create({
      baseURL: 'http://192.168.1.78:3000/spotify-api/play',
      timeout: 3000,
      headers: {'timeSent': (new Date()).getTime() }
    })
  }

  instance.put('', {}).then(function(response) {
    console.log(response);
  }).catch(function(error) {
    console.log(error);
  })
}

// For previous/next song
function sendPlaybackCommand(type) {
  var instance;
  if(type === 'next') {
    instance = axios.create({
      baseURL: 'http://192.168.1.78:3000/spotify-api/next-song',
      timeout: 3000

    })
  } else if(type === 'previous') {
    instance = axios.create({
      baseURL: 'http://192.168.1.78:3000/spotify-api/previous-song',
      timeout: 3000
    })
  }

  instance.post('', {}).then(function(response) {
    // After going to the next/previous song, get the info about it
    getPlaybackInfo()

  }).catch(function(error) {
    console.log(error)
  })
}

function getPlaybackInfo() {

  var instance = axios.create({
    baseURL: 'http://192.168.1.78:3000/spotify-api/playback-info',
    timeout: 3000 //,
    // params: { timeSent: (new Date()).getTime() }
  })

  instance.get('', {}).then(function(response) {
    // We have an invalid access token and need to refresh the page to reauthenticate
    if(response.data == 'refresh-page') {
      location.reload();
    }

    playing = response.data.is_playing
    current_track = {}
    current_track.name = response.data.track
    current_track.artist = response.data.artist
    current_track.album_name = response.data.album_name
    current_track.album_image = response.data.album_image

    $('#current-track').text(current_track.name)
    $('#current-artist').text(current_track.artist)

    $('#album-cover').attr('src', current_track.album_image)

    var d = new Date();
    // If it's been shorter than 1.1 seconds since we changed playback state, don't do Anything
    // This is to prevent the pause/play button changing repeatedly when we press it and we retrieve playback info
    //   at the same time.
    if(d.getTime() - lastPlaybackPress > 1100) {
      if(playing) {
        $('#play-pause').attr('src', '/public/assets/pause.png')
      } else {
        $('#play-pause').attr('src', '/public/assets/play.png')
      }
    }

    // current_track.trackName
  }).catch(function(error) {
    console.log(error)
  })
}

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
