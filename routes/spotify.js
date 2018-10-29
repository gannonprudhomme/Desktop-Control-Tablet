var express = require('express')
var request = require('request')
var router = express.Router()

var commands = require('./commands.js')

// Spotify constants
const client_id = 'a6b183eb82c84480aa98deec6cba9b92'
const client_secret = '156fa2b93faa41afb74bebf84b148ac3'
const redirect_uri = 'http://192.168.1.78:3000/tablet'

// Spotify values returned from authentication
var access_token;
var refresh_token; // Used to request a new access token after a certain amount of time
// var access_code;
var stateKey = 'spotify_auth_state'

var socketHandler = function(socket) {
  // var spotify = io.of('/spotify')
  socket.on('get_track', function(data, ret) {
    var options = {
      url: 'https://api.spotify.com/v1/me/player/currently-playing',
      headers: {'Authorization': 'Bearer ' + access_token},
      json: true
    }

    var timeReceived = (new Date()).getTime()

    request.get(options, function(error, response, body) {
      if(!error && response.statusCode === 200) {
          var sendToClient = {}

          // If there isn't a track currently playing, don't attempt to send it
          if(body.item) {
            sendToClient.track = body.item.name
            sendToClient.artist = body.item.album.artists[0].name
            sendToClient.album_name = body.item.album.name
            sendToClient.album_image = body.item.album.images[1].url
          } else {
            console.log('Not currently playing track, preventing error')
          }

          sendToClient.is_playing = body.is_playing

          sendToClient.timeSent = (new Date()).getTime()

          var diff = (sendToClient.timeSent - timeReceived);
          // console.log('Play: Spotify retrieval ' + diff + 'ms')

          ret(sendToClient)
        } else if(response && response.statusCode === 204) {
          // Nothing is playing, do nothing
          console.log('204')

        } else {
          process.stdout.write("Playback info error: ")
          console.log(body)
          console.log(error)

          if(body && body.error && body.error.status === 401) {
            console.log(body.error.message)

            if(body.error.message === 'Invalid access token') {
              authenticated = false

              // requestAccessToken()
              // Redirect the client to back to /tablet to force reauthentication
              // Alternatively, tell the client to refresh the page (or do it for them)
            } else if(body.error.message === 'The access token expired') {
              // Refresh the access token
              refreshToken()
            }
          }
        }
    })
  })

  socket.on('play', function(data) {
    var delay = (new Date()).getTime() - data
    console.log('Play delay: ' + delay)
    commands.saveDelay(delay)

    commands.sendKeypress('ctrl+alt+up')
  })

  socket.on('pause', function(data) {
    var delay = (new Date()).getTime() - data
    console.log('Pause delay: ' + delay)
    commands.saveDelay(delay)

    commands.sendKeypress('ctrl+alt+up')
  })

  socket.on('next', function(data) {
    var delay = (new Date()).getTime() - data
    console.log('Next delay: ' + delay)
    commands.saveDelay(delay)

    commands.sendKeypress('ctrl+alt+right')
  })

  socket.on('previous', function(data) {
    var delay = (new Date()).getTime() - data
    console.log('Prev delay: ' + delay)
    commands.saveDelay(delay)

    commands.sendKeypress('ctrl+alt+left')
  })

  // return router
}

// Request an access token using the provided refresh token
function refreshToken() {
  console.log('Refreshing access token')

  var options  = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))      },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  }

  request.post(options, function(error, response, body) {
    if(!error) {
      access_token = body.access_token
      console.log('Refreshed access token successfully!')
    } else {
      console.log(error)
      console.log(body)
    }
  })
}

// Used in GET /tablet initial authorization
function setTokens(access, refresh) {
  access_token = access;
  refresh_token = refresh;
}

module.exports.socketHandler = socketHandler
module.exports.setTokens = setTokens
// Send out spotify constants
module.exports.client_id = client_id
module.exports.client_secret = client_secret
module.exports.redirect_uri = redirect_uri
