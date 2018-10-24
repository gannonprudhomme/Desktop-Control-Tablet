const express = require('express')
const multer = require('multer') // for parsing multipart/form-data
const bodyParser = require('body-parser') // for parsing basic request data?
const path = require('path')
var fs = require('fs')
var queryString = require('querystring')

const app = express()
const port = 3000
var upload = multer()

// Have a local instance of the volume and (eventually) only saving it on change
var volumes = {};
var volumeData = JSON.parse(fs.readFileSync(path.join(__dirname + '/public/volumeData.json'), 'utf-8'))

// Spotify properties
//var spotify = require('./spotify.js')(app)

// discord
var discord = require('./discord.js')
var desktop = require('./desktop_control.js')

app.use(discord)
app.use(desktop)

// Set properties
app.use(express.static(__dirname))
app.use(bodyParser.json()); // For parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://192.168.1.78:3000');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET');

  next();
})

var authenticated = false;

// app.use(express.static(__dirname + '/public/'))

// Redirect to spotify authentication?
app.get('/tablet', (req, res) => {
  if(!authenticated) {
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

    authenticated = true;
  } else {
    res.sendFile(path.join(__dirname + '/public/tablet/index.html'))

    // After authenticating, get the access and refresh tokens
    // have a function that takes req as a parameter(or req.query)
    var code = req.query.code || null;
    var state = req.query.state || null;

    access_code = code;
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    }

    request.post(authOptions, function(error, response, body) {
      if(!error && response.statusCode === 200) {
        access_token = body.access_token;
        refresh_token = body.refresh_token;
      } else {
        console.log(error)
      }
    })
  }
})

app.get('/mobile', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/mobile/control.html'))
})

// Handle REST calls
app.get('/', (req, res) => {
})

app.post('/volume', (req, res) => {
  //res.send("got a post request");
  console.log(req.body)
  res.send("Received package!")

  //volumes[req.body.program] = req.body.volume;
  volumeData[req.body.program] = req.body.volume;
  saveVolumeData();

  changeVolume(req.body.program, req.body.volume)
})

app.get('/volume/data', (req, res) => {
  res.send(volumeData);
  console.log("Sent volume data")
})

// Listen to this port, and handle any errors accordingly
app.listen(port, (err) => {
  if(err) {
    return console.log("something bad happened", err)
  }

  console.log(`server is listening on ${port}`)

  // Fill the volume map with all of the previous data here
  // Doesn't need to be asynchronous
  var volumeData = JSON.parse(fs.readFileSync(path.join(__dirname + '/public/volumeData.json'), 'utf-8'))

  // Iterate over all of the keys(programs) in the json object
  // And add them to the local map
  for(key in volumeData) {
    volumes[key] = volumeData[key];
  }
})

var {exec} = require('child_process')
function changeVolume(programName, volume) {
  exec('nircmd true setappvolume ' + programName + ' ' + volume)
}

// Write the volume data to the file
function saveVolumeData() {
  fs.writeFile(path.join(__dirname + '/public/volumeData.json'), JSON.stringify(volumeData), function(error) {
    if(error)
      console.log(error)
  })
}

function maximizeWindow(programName) {

}

// SPOTIFY STUFF
var request = require('request')
var cookieParser = require('cookie-parser')

  // Anything with module preceding it will be accessible 'outside'
  // Anything without it will be seen as private
  //var module = {}

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
app.post('/spotify-api/next-song', (req, res) => {
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

app.post('/spotify-api/previous-song', (req, res) => {
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

app.put('/spotify-api/pause', (req, res) => {
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
app.put('/spotify-api/play', (req, res) => {
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
app.get('/spotify-api/playback-info', (req, res) => {
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
