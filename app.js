const express = require('express')
const bodyParser = require('body-parser') // for parsing basic request data?
const path = require('path')
const fs = require('fs')
const http = require('http')
const socketIO = require('socket.io')

// Routes
const Spotify = require('./server/routes/spotify.js')
const Desktop = require('./server/routes/desktop.js')
const SocketHandler = require('./server/routes/sockets.js')
const SmartLight = require('./server/routes/lights.js') // controlling tp-link lightbulb from f.lux
const Weather = require('./server/routes/weather.js')

const Communication = require('./server/communication.js')

// const spotifyAuthenticated = false

class Server {
  constructor() {
    this.port = 3000
    this.settings = JSON.parse(fs.readFileSync('./view-settings.json', 'utf-8'))

    // console.log(settings)
    this.desktop = new Desktop(this.settings)
    this.spotify = new Spotify(this.settings)
    this.smartLights = new SmartLight()

    const communication = new Communication(this.settings, this.desktop)
    const weather = new Weather()
    const routers = [this.desktop, this.spotify, this.smartLights, communication, weather]

    this.socketHandler = new SocketHandler(routers)
    this.spotifyAuthenticated = false

    this.initialize()
    this.handleRoute()
  }

  // Initialize the rest of the server
  initialize() {
    // Initialize the server
    this.app = express()
    this.server = http.createServer(this.app)

    // Set properties
    this.app.use(express.static(__dirname))
    this.app.use(bodyParser.json()); // For parsing application/json
    this.app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

    this.app.set('views', path.join(__dirname + '/public/views'));
    this.app.locals.baseDir = path.join(__dirname + '/public/views') // Set options.baseDir for Pug
    this.app.set('view engine', 'pug') // 'hbs' is connected to the app.engine('hbs', ...)

    // Set up the f.lux HTTP/REST endpoint
    this.app.use(this.smartLights.router)
  }

  // Start the server
  start() {
    // Begin the socket-io server
    this.io = socketIO.listen(this.server)
    this.app.use(this.socketHandler.returnRouter(this.io))

    // Listen to this port, and handle any errors accordingly
    this.server.listen(this.port, (err) => {
      if(err) {
        return console.log('something bad happened', err)
      }

      console.log(`server is listening on ${this.port}`)

      this.desktop.importVolumeData()
    })
  }

  // Set up the main /tablet HTTP route
  handleRoute() {
    this.app.get('/tablet', (req, res) => {
      if(!this.spotifyAuthenticated) {
        this.spotify.authenticateSpotify(res)

        this.spotifyAuthenticated = true;

        console.log('Redirecting to Spotify')
      } else {
        console.log('Redirected from Spotify, initializing')

        // Load in the settings file
        const json = JSON.parse(fs.readFileSync(path.join(__dirname + '/view-settings.json'), 'utf8'))
        let options = {
          show_current_time: json['show-current-time'],
          quickIcons: json['quickIcons'],
          modules: json['modules'],
          currentModules: json['currentModules'],
          volumeMixers: json['volume-mixers'],
        }

        // Load in all of the settings data for all of our current modules
        const modSettings = this.desktop.getModuleSettings(json['currentModules'])

        // Add the module settings to the above option settings, to be sent to Pug to be used in our page
        options = {...options, ...modSettings}

        // Render the webpage
        res.render('index', options)

        // After authenticating, get the access and refresh tokens
        // have a function that takes req as a parameter(or req.query)
        const code = req.query.code || null
        const state = req.query.code || null

        // Get authentication tokens for use in Spotify
        this.spotify.getAuthArguments(code, state)
      }
    })
  }

  // Kill the server
  // Called when the Electron app is shutting down, and during testing
  kill() {
    process.exit()
  }
}

module.exports = Server
