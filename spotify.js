var request = require('request')
var cookieParser = require('cookie-parser')

var express = require('express')
var router = express.Router()

// SPOTIFY STUFF
var request = require('request')
var cookieParser = require('cookie-parser')

var client_id = 'a6b183eb82c84480aa98deec6cba9b92'
var client_secret = '156fa2b93faa41afb74bebf84b148ac3'
var redirect_uri = 'http://192.168.1.78:3000/tablet'

var access_token;
var refresh_token; // Used to request a new access token after a certain amount of time
var access_code;
var stateKey = 'spotify_auth_state'

  // Retrieve formatted track data from Spotify and send in response to tablet
router.get('/spotify-api/current-track', (req, res) => { })

  // Tell spotify to skip to the next song
router.post('/spotify-api/next-song', (req, res) => {
  var options = {
    url: 'https://api.spotify.com/v1/me/player/next',
    headers: {'Authorization': 'Bearer ' + access_token }
  }

  request.post(options, function(error, response, body) {
    if(response.statusCode === 204) {

    } else {
      console.log('next-song error')
      console.log(error)
      console.log(body)
    }
  })
})

router.post('/spotify-api/previous-song', (req, res) => {
  var options = {
    url: 'https://api.spotify.com/v1/me/player/previous',
    headers: {'Authorization': 'Bearer ' + access_token }
  }

  request.post(options, function(error, response, body) {
    if(response.statusCode === 204) {

    } else {
      console.log('previous-song error')
      console.log(error)
      console.log(body)
    }
  })
})

router.put('/spotify-api/pause', (req, res) => {
  var options = {
    url: 'https://api.spotify.com/v1/me/player/pause',
    headers: {
      "Authorization": "Bearer " + access_token
    }
  }

  request.put(options, function(error, response, body) {
    if(!error && response.statusCode === 204) {

    } else {
      console.log('pause error')
      console.log(error)
      console.log(body)

      // Have an error status code check here
      refreshToken()
    }
  })
})

  // Tell Spotify to resume playback
router.put('/spotify-api/play', (req, res) => {
  var options = {
    url: 'https://api.spotify.com/v1/me/player/play',
    headers: {
      "Authorization": "Bearer " + access_token
    }
  }

  request.put(options, function(error, response, body) {
    if(response.statusCode === 204) {

    } else {
      console.log('play error')
      console.log(error)
      console.log(body)

      // Have an error status code check here
      refreshToken()
    }
  })
})

// Retrieve and send back playback info: including currently playing track info and if a song is actively playing
router.get('/spotify-api/playback-info', (req, res) => {
  var options = {
    url: 'https://api.spotify.com/v1/me/player/currently-playing',
    headers: {'Authorization': 'Bearer ' + access_token},
    json: true
  }

  request.get(options, function(error, response, body) {
    if(!error && response.statusCode === 200) {
      var sendToClient = {}
      sendToClient.is_playing = body.is_playing;
      sendToClient.track = body.item.name;
      sendToClient.artist = body.item.album.artists[0].name;
      sendToClient.album_name = body.item.album.name
      sendToClient.album_image = body.item.album.images[1].url

      res.send(sendToClient)
    } else {
      if(body && body.error && body.error.status === 401) {
        //res.send('refresh-page')
      }

      console.log('playback-info error')
      console.log(body)
    }
  })
})

function redirectToAuth(res) {
  res.redirect('http://192.168.1.78:3000/tablet')

  authenticated = false
}

function getRedirectString() {
  var state = generateRandomString(16);

  //res.cookie(stateKey, state);
  var scope = 'user-read-private user-read-playback-state user-modify-playback-state user-read-currently-playing'
  return queryString.stringify({
    response_type:'code',
    client_id: client_id,
    scope: scope,
    redirect_uri: redirect_uri,
    state: state
  })
  }

function refreshToken() {
  var options  = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))      },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    }
  }

  request.post(options, function(error, response, body) {
    if(!error) {
      access_token = response.access_token
      console.log(error)
      console.log(body)
    } else {
      console.log(error)
      console.log(body)
    }
  })
}

  /**
   * Generates a random string containing numbers and letters
   * @param  {number} length The length of the string
   * @return {string} The generated string
   */
  var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };
