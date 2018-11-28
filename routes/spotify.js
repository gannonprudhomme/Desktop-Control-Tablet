var express = require('express')
var request = require('request')
var router = express.Router()
var queryString = require('querystring')

var commands = require('./commands.js')

// Get the settings json-data from the desktop script
var settings = require('./desktop.js').settings

// Spotify constants
const client_id = 'a6b183eb82c84480aa98deec6cba9b92'
const client_secret = '156fa2b93faa41afb74bebf84b148ac3'
var redirect_uri = 'http://' + settings['host-ip'] +  ':3000/tablet';

// Spotify values returned from authentication
var access_token;
var refresh_token; // Used to request a new access token after a certain amount of time
// var access_code;
var stateKey = 'spotify_auth_state'

// console.log(redirect_uri)

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
          // process.stdout.write("Playback info error: ")
          // console.log(body)
          // console.log(error)

          if(body && body.error && body.error.status === 401) {
            // console.log(body.error.message)

            if(body.error.message === 'Invalid access token') {
              authenticated = false

              // requestAccessToken()
              // Redirect the client to back to /tablet to force reauthentication
              // Alternatively, tell the client to refresh the page (or do it for them)
            } else if(body.error.message === 'The access token expired') {
              // Refresh the access token
              process.stdout.write("Playback info error: ")
              console.log(body.error.message)
              refreshToken()

            } else {
              process.stdout.write("Playback info error: ")
              console.log(body.error.message)
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

// Redirect to the client to authetnicate with Spotify
function authenticateSpotify(res) {
  var state = generateRandomString(8);

  //res.cookie(stateKey, state);
  var scope = 'user-read-private user-read-playback-state user-modify-playback-state user-read-currently-playing'
  res.redirect('https://accounts.spotify.com/authorize?' +
    queryString.stringify({
      response_type:'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    })
  )
}

function getAuthArguments(code, state) {
  // Request options to be sent to the spotify server
    access_code = code;
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    }

    // Retrieve the authorization code from Spotify and set the returned access tokens
    // The access token is to authorize each spotify change, and the refresh token is to refresh a new access token
    // after it has expired
    request.post(authOptions, function(error, response, body) {
      if(!error && response.statusCode === 200) {
        setTokens(body.access_token, body.refresh_token)
      } else {
        console.log(error)
      }
    })
}

// Request an access token using the provided refresh token
function refreshToken() {
  console.log('Refreshing access token')

  var options  = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))      },
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

// Set the redirect uri to be reurned to after authenticating with Spotify
function setRedirectUri(uri) {
  redirect_uri = uri
}

module.exports.setRedirectUri = setRedirectUri
module.exports.socketHandler = socketHandler
module.exports.setTokens = setTokens
// Send out spotify constants
module.exports.client_id = client_id
module.exports.client_secret = client_secret
module.exports.redirect_uri = redirect_uri

module.exports.authenticateSpotify = authenticateSpotify
module.exports.getAuthArguments = getAuthArguments

var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};