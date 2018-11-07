var playing = false // Retrieve the current state of playback from Spotify on launch
var current_track = {} // Dictionary/JSON object for the currently played song. Contains track name, album name, artist, and album image link
var lastPlaybackPress = 0 // Time since the last playback press
var lastTrackRequest = 0 // Time since we last requested for a track,

// var socket = io('/spotify')
// io.connect('/spotify')
var socket = io()

$(document).ready(function() {
  getPlaybackInfo()
})
// Check for playback changes every 2 seconds
window.setInterval(function() {
  getPlaybackInfo()

}, 500)

$('#power-button').click(function() {
  desktopPut('sleep')
})

$("#play-pause").click(function() {
  lastPlaybackPress = (new Date()).getTime();

  // If it's playing when we press the button, pause it
  if(playing) {
    playing = false;

    // Swap to the play image
    $('#play-pause').attr('src', '/public/assets/play.png')

    sendPlayback('pause')
  } else {
    playing = true

    // Swap to the pause image
    $('#play-pause').attr('src', '/public/assets/pause.png')

    sendPlayback('play')
  }
})

$('#previous-song').click(function() {
  sendPlayback('previous')
})

$('#next-song').click(function() {
  sendPlayback('next')
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
      console.log('next')
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
    // console.log(data)

    current_track = {}
    current_track.name = data.track
    current_track.artist = data.artist
    current_track.album_name = data.album_name
    current_track.album_image = data.album_image

    // Set the according data for the HTML elements
    $('#current-track').text(current_track.name)
    $('#current-artist').text(current_track.artist)

    $('#album-cover').attr('src', current_track.album_image)

    // If it's been more than a second since the last time we manually paused Playback
    // Then the playback change wasn't from the client, thus update the playback icon
    if((new Date()).getTime() - lastPlaybackPress > 1000) {
      playing = data.is_playing

      if(playing) {
        $('#play-pause').attr('src', '/public/assets/pause.png')
      } else {
        $('#play-pause').attr('src', '/public/assets/play.png')
      }
    }
  })
}

function sendDesktopCommand(type) {
  var now = (new Date()).getTime()
  socket.emit('desktop_' + type, now)
}
