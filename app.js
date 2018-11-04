var express = require('express')
var multer = require('multer') // for parsing multipart/form-data
var bodyParser = require('body-parser') // for parsing basic request data?
var path = require('path')
var fs = require('fs')
var queryString = require('querystring')
var request = require('request')

var exHbs = require('express-handlebars') //
var helpers = require('handlebars-helpers')()

var handleBars = exHbs.create({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: __dirname + '/public/handlebars/views/layouts/',
  partialsDir: __dirname + '/public/handlebars/views/partials',
  helpers: helpers
})

const app = express()
const port = 3000

// Socket.io stuff
var http = require('http')
var server = http.createServer(app)
var io = require('socket.io').listen(server)

// Routes
var spotify = require('./routes/spotify.js')
var discord = require('./routes/discord.js')
var desktop = require('./routes/desktop.js')
var socket = require('./routes/sockets.js')(io)

// 'hps' is the internal name of handleBars and the extension(.hbs) name
// 'layout' is the default layout(layout.hbs) to be used by HandleBars
app.engine('hbs', handleBars.engine);
app.set('views', path.join(__dirname + '/public/handlebars/views'));
app.set('view engine', 'hbs') // 'hbs' is connected to the app.engine('hbs', ...)

app.use(discord)
app.use(socket)
//app.use(desktop.router(io))
//app.use(spotify.router(io))

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

app.get('/handlebars', (req, res) => {
  //  Load in settings file
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
    var json = JSON.parse(fs.readFileSync(path.join(__dirname + '/view-settings.json'), 'utf8'))
    res.render('index.hbs', {
      show_current_time: json['show-current-time'], 
      quickIcons: json['quickIcons'],
      modules: json['modules'],
      currentModules: json['currentModules'],
      volumeMixers: json['volume-mixers']
    })

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

// Listen to this port, and handle any errors accordingly
server.listen(port, (err) => {
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
