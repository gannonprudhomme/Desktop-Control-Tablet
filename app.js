var express = require('express')
var multer = require('multer') // for parsing multipart/form-data
var bodyParser = require('body-parser') // for parsing basic request data?
var path = require('path')
var fs = require('fs')
var queryString = require('querystring')
var request = require('request')

const app = express()
const port = 3000
var upload = multer()

// Have a local instance of the volume and (eventually) only saving it on change
var volumes = {};
var volumeData = JSON.parse(fs.readFileSync(path.join(__dirname + '/public/volumeData.json'), 'utf-8'))

// Spotify properties
var spotify = require('./routes/spotify.js')

// discord
var discord = require('./routes/discord.js')
var desktop = require('./routes/desktop_control.js')

app.use(discord)
app.use(desktop.router)
app.use(spotify.router)

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
        client_id: spotify.client_id,
        scope: scope,
        redirect_uri: spotify.redirect_uri,
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
        redirect_uri: spotify.redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(spotify.client_id + ':' + spotify.client_secret).toString('base64'))
      },
      json: true
    }

    request.post(authOptions, function(error, response, body) {
      if(!error && response.statusCode === 200) {
        spotify.setTokens(body.access_token, body.refresh_token)
      } else {
        console.log(error)
      }
    })
  }
})

app.get('/mobile', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/mobile/control.html'))
})

// Listen to this port, and handle any errors accordingly
app.listen(port, (err) => {
  if(err) {
    return console.log("something bad happened", err)
  }

  console.log(`server is listening on ${port}`)

  desktop.loadVolumeData()
})


function maximizeWindow(programName) {

}

var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };
