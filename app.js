var express = require('express')
var multer = require('multer') // for parsing multipart/form-data
var bodyParser = require('body-parser') // for parsing basic request data?
var path = require('path')
var fs = require('fs')
var queryString = require('querystring')
var request = require('request')

const app = express()
const port = 3000

// Socket.io stuff
var http = require('http')
var server = http.createServer(app)
var io = require('socket.io').listen(server)

var spotifyAuthenticated = false;

// Routes
var spotify = require('./routes/spotify.js')
var discord = require('./routes/discord.js')
var desktop = require('./routes/desktop.js')
var socket = require('./routes/sockets.js')(io)
var fluxbulb = require('./routes/lights.js')  // controlling tp-link lightbulb from f.lux 
var tasks = require('./routes/tasks.js')

// Attach Handlebars
// 'hps' is the internal name of handleBars and the extension(.hbs) name
// 'layout' is the default layout(layout.hbs) to be used by HandleBars
app.set('views', path.join(__dirname + '/public/views'));
app.set('view engine', 'pug') // 'hbs' is connected to the app.engine('hbs', ...)
app.locals.baseDir = path.join(__dirname + '/public/views') // Set options.baseDir for Pug

app.use(discord)
app.use(socket)
app.use(fluxbulb.router)

// Set properties
app.use(express.static(__dirname))
app.use(bodyParser.json()); // For parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

app.get('/tablet', (req, res) => {
  if(!spotifyAuthenticated) {
    spotify.authenticateSpotify(res)

    spotifyAuthenticated = true;
  } else {
    // Load in the settings file
    var json = JSON.parse(fs.readFileSync(path.join(__dirname + '/view-settings.json'), 'utf8'))
    var options = {
      show_current_time: json['show-current-time'], 
      quickIcons: json['quickIcons'],
      modules: json['modules'],
      currentModules: json['currentModules'],
      volumeMixers: json['volume-mixers']
    }

    // Load in all of the settings data for all of our current modules
    var modSettings = desktop.getModuleSettings(json['currentModules'])

    // Add the module settings to the above option settings, to be sent to Pug to be used in our page
    options = {...options, ...modSettings}

    // Render the webpage
    res.render('index', options)

    
    // After authenticating, get the access and refresh tokens
    // have a function that takes req as a parameter(or req.query)
    var code = req.query.code || null
    var state = req.query.code || null

    // Get authentication tokens for use in Spotify
    spotify.getAuthArguments(code, state)
  }
})

app.get('/tablet/settings', (req, res) => {
  var json = JSON.parse(fs.readFileSync(path.join(__dirname + '/view-settings.json'), 'utf8'))
  var options = {
    show_current_time: json['show-current-time'], 
    quickIcons: json['quickIcons'],
    modules: json['modules'],
    currentModules: json['currentModules'],
    hostIP: json['host-ip']
  }

  var modSett = desktop.getModuleSettings(json['currentModules'])

  options = {...options, ...modSett}

  res.render('settings', options)
})

// Listen to this port, and handle any errors accordingly
server.listen(port, (err) => {
  if(err) {
    return console.log("something bad happened", err)
  }

  console.log(`server is listening on ${port}`)

  desktop.importVolumeData()
})

var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};