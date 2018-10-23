var request = require('request')
var cookieParser = require('cookie-parser')

module.exports = function(app) {
  // Anything with module preceding it will be accessible 'outside'
  // Anything without it will be seen as private/within this scope
  var module = {}

  var client_id = 'a6b183eb82c84480aa98deec6cba9b92'
  var client_secret = '156fa2b93faa41afb74bebf84b148ac3'
  var redirect_uri = 'http://192.168.1.78:3000/tablet'


  var access_token;
  var refresh_token; // Used to request a new access token after a certain amount of time
  var access_code;
  var stateKey = 'spotify_auth_state'

  // Retrieve formatted track data from Spotify and send in response to tablet
  app.get('/spotify-api/current-track', (req, res) => { })

  // Tell spotify to skip to the next song
  app.post('/spotify-api/next-song', (req, res) => {})

  // Tell Spotify to pause playback
  app.put('spotify-api/pause', (req, res) => {})

  // Tell Spotify to resume playback
  app.put('/spotify-api/play', (req, res) => {})

  getRedirectString = function() {
    var state = generateRandomString(16);

    res.cookie(stateKey, state);
    var scope = 'user-read-private user-read-playback-state user-modify-playback-state user-read-currently-playing'
    return queryString.stringify({
      response_type:'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    })
  }

  refreshToken = function() {
    var options  = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      }
    }
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
}
