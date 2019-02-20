(function() {
  var express = require('express')
  var multer = require('multer') // for parsing multipart/form-data
  var bodyParser = require('body-parser') // for parsing basic request data?
  var path = require('path')
  var fs = require('fs')
  var queryString = require('querystring')
  // var request = require('request') // Unused?

  const app = express()
  const port = 3000

  // Socket.io stuff
  var http = require('http')
  var server = http.createServer(app)
  var io = require('socket.io').listen(server)

  // Routes
  var spotify = require('./server/routes/spotify.js')
  var desktop = require('./server/routes/desktop.js')
  var socket = require('./server/routes/sockets.js')(io)
  var fluxbulb = require('./server/routes/lights.js')  // controlling tp-link lightbulb from f.lux 
  var tasks = require('./server/tasks.js')

  var communication = require('./server/communication.js')

  app.set('views', path.join(__dirname + '/public/views'));
  app.set('view engine', 'pug') // 'hbs' is connected to the app.engine('hbs', ...)
  app.locals.baseDir = path.join(__dirname + '/public/views') // Set options.baseDir for Pug
  app.use(socket)
  app.use(fluxbulb.router)

  // Set properties
  app.use(express.static(__dirname))
  app.use(bodyParser.json()); // For parsing application/json
  app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

  var spotifyAuthenticated = false

  app.get('/tablet', (req, res) => {
    if(!spotifyAuthenticated) {
      spotify.authenticateSpotify(res)

      spotifyAuthenticated = true;

      console.log('Redirecting to Spotify')

    } else {
      console.log('Redirected from Spotify, initializing')

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

  
  // Listen to this port, and handle any errors accordingly
  server.listen(port, (err) => {
    if(err) {
      return console.log("something bad happened", err)
    }

    console.log(`server is listening on ${port}`)

    desktop.importVolumeData()
  })

  function kill() {
    process.exit()
  }

  module.exports.kill = kill

  var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }; 
}())