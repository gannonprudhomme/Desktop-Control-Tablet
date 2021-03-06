const request = require('request')
const queryString = require('querystring')
const communication = require('../communication.js')

const Route = require('./route.js')

// The Spotify route
class Spotify extends Route {
  constructor(settings, communication) {
    super()

    this.communication = communication

    // Spotify constants
    this.redirectUri = 'http://' + settings['host-ip'] + ':3000/tablet'
    this.clientId = 'a6b183eb82c84480aa98deec6cba9b92'
    this.clientSecret = '156fa2b93faa41afb74bebf84b148ac3'

    this.useToastify = settings['use-toastify']

    // Spotify values returned from authentication
    // this.accessToken = ''
    // this.refreshToken = ''
  }

  socketHandler(socket) {
    socket.on('get_track', (data, ret) => {
      const options = {
        url: 'https://api.spotify.com/v1/me/player/currently-playing?additional_types=episode',
        headers: {'Authorization': 'Bearer ' + this.accessToken},
        json: true,
      }

      const timeReceived = (new Date()).getTime()

      request.get(options, (error, response, body) => {
        if(!error && response.statusCode === 200) {
          const sendToClient = {}

          if (body.currently_playing_type === 'track') { // it's a song
            if (body.item) {
              const { name, album } = body.item;

              sendToClient.track = name
              sendToClient.artist = album.artists[0].name
              sendToClient.album_name = album.name
              sendToClient.album_image = album.images[1].url // the 300px one, not 640px
            }
          } else if (body.currently_playing_type === 'episode') { // it's a podcast
            if (body.item) {
              const { name, show } = body.item;

              sendToClient.track = name;
              sendToClient.artist = show.name;
              sendToClient.album_name = show.name; // I guess?
              sendToClient.album_image = show.images[1].url;
            }
          }

          sendToClient.is_playing = body.is_playing

          ret(sendToClient)
        } else if(response && response.statusCode === 204) {
          // Nothing is playing, do nothing
          // console.log('204')

        } else {
          // process.stdout.write("Playback info error: ")
          // console.log(body)
          // console.log(error)

          if(body && body.error && body.error.status === 401) {
            // console.log(body.error.message)

            if(body.error.message === 'Invalid access token') {
              this.authenticated = false

              // requestAccessToken()
              // Redirect the client to back to /tablet to force reauthentication
              // Alternatively, tell the client to refresh the page (or do it for them)
            } else if(body.error.message === 'The access token expired') {
              // Refresh the access token
              console.log(body.error.message)
              this.refreshAuthToken()
            } else {
              console.log(body.error.message)
            }
          }
        }
      })
    })

    socket.on('play', (data) => {
      const delay = (new Date()).getTime() - data

      // Only use the toastify shortcut if the setting is enabled & we're connected to the server
      if(this.useToastify && this.communication.connected) {
        this.communication.sendKeypress('ctrl+alt+up')
      } else {
        this.sendSpotifyCommand('play')
      }
    })

    socket.on('pause', (data) => {
      const delay = (new Date()).getTime() - data

      // Only use the toastify shortcut if the setting is enabled & we're connected to the server
      if(this.useToastify && this.communication.connected) {
        this.communication.sendKeypress('ctrl+alt+up')
      } else {
        this.sendSpotifyCommand('pause')
      }
    })

    socket.on('next', (data) => {
      const delay = (new Date()).getTime() - data

      // Only use the toastify shortcut if the setting is enabled & we're connected to the server
      if(this.useToastify && this.communication.connected) {
        this.communication.sendKeypress('ctrl+alt+right')
      } else {
        this.sendSpotifyCommand('next')
      }
    })

    socket.on('previous', (data) => {
      const delay = (new Date()).getTime() - data

      // Only use the toastify shortcut if the setting is enabled & we're connected to the server
      if(this.useToastify && this.communication.connected) {
        this.communication.sendKeypress('ctrl+alt+left')
      } else {
        this.sendSpotifyCommand('previous')
      }
    })
  }

  // Redirect to the client to authetnicate with Spotify
  authenticateSpotify(res) {
    const state = this.generateRandomString(8);

    // res.cookie(stateKey, state);
    const scope = 'user-read-private user-read-playback-state user-modify-playback-state user-read-currently-playing'
    res.redirect('https://accounts.spotify.com/authorize?' +
      queryString.stringify({
        response_type: 'code',
        client_id: this.clientId,
        scope: scope,
        redirect_uri: this.redirectUri,
        state: state,
      })
    )
  }

  getAuthArguments(code, state) {
    // Request options to be sent to the spotify server
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: this.redirectUri,
        grant_type: 'authorization_code',
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer.from(this.clientId + ':' + this.clientSecret).toString('base64'))
      },
      json: true,
    }

    // Retrieve the authorization code from Spotify and set the returned access tokens
    // The access token is to authorize each spotify change, and the refresh token is to refresh a new access token
    // after it has expired
    request.post(authOptions, (error, response, body) => {
      if(!error && response.statusCode === 200) {
        this.setTokens(body.access_token, body.refresh_token)
      } else {
        console.log(error)
      }
    })
  }

  // Request an access token using the provided refresh token
  refreshAuthToken() {
    console.log('Refreshing access token')

    const options = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Authorization': 'Basic ' + (new Buffer.from(this.clientId + ':' + this.clientSecret).toString('base64'))      },
      form: {
        grant_type: 'refresh_token',
        refresh_token: this.refreshToken,
      },
      json: true,
    }

    request.post(options, (error, response, body) => {
      if(!error) {
        this.accessToken = body.access_token
        console.log('Refreshed access token successfully!')
      } else {
        console.log(error)
        console.log(body)
      }
    })
  }

  // Used in GET /tablet initial authorization
  setTokens(access, refresh) {
    this.accessToken = access;
    this.refreshToken = refresh;
  }

  // Set the redirect uri to be reurned to after authenticating with Spotify
  setRedirectUri(uri) {
    this.redirectUri = uri
  }

  sendSpotifyCommand(command) {
    const options = {
      url: 'https://api.spotify.com/v1/me/player/' + command,
      headers: {
        'Authorization': 'Bearer ' + this.accessToken,
      },
    }

    if(command == 'play' || command == 'pause') { // Send PUT call for pause & play
      // Send the playback command to the Spotify server
      request.put(options, function(error, response, body) {
        if(!error) {

        } else {
          console.log(error)
          console.log(body)
        }
      })
    } else { // Send POST call for next & previous songs
      // Send the playback command to the Spotify server
      request.post(options, function(error, response, body) {
        if(!error) {

        } else {
          console.log(error)
          console.log(body)
        }
      })
    }
  }

  generateRandomString(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };
}

module.exports = Spotify
