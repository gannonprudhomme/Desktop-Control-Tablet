var playing = false // Retrieve the current state of playback from Spotify on launch
var current_track = {} // Dictionary/JSON object for the currently played song. Contains track name, album name, artist, and album image link
// var lastPlaybackPress = 0 // Time since the last playback press

// var socket = io('/spotify')
// io.connect('/spotify')
var socket = io()

$(document).ready(function() {
  getPlaybackInfo()
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

    sendPlayback('play')
  } else {
    playing = true

    // Swap to the pause image
    $('#play-pause').attr('src', '/public/assets/pause.png')

    sendPlayback('pause')
  }
})

$('#previous-song').click(function() {
  sendPlaybackCommand('previous')
})

$('#next-song').click(function() {
  sendPlaybackCommand('next')
})

// Send a Spotify playback update to the server
function sendPlayback(type) {
  var now = (new Date()).getTime()

  switch(type) {
    case 'play':
      socket.emit('play', now)

      break
    case 'pause':
      socket.emit('pause', now)

      break
    case 'next':
      socket.emit('next', now)

      break
    case 'previous':
      socket.emit('previous', now)

      break
  }
}

function getPlaybackInfo() {
  var now = (new Date()).getTime()

  socket.emit('get_track', now, function(data) {
    console.log(data)

    playing = data.is_playing
    current_track = {}
    current_track.name = data.track
    current_track.artist = data.artist
    current_track.album_name = data.album_name
    current_track.album_image = data.album_image

    // Set the according data for the HTML elements
    $('#current-track').text(current_track.name)
    $('#current-artist').text(current_track.artist)

    $('#album-cover').attr('src', current_track.album_image)
  })
}

function sendDesktopCommand(type) {
  var now = (new Date()).getTime()
  socket.emit('desktop_' + type, now)
}
