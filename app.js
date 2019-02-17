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
  var spotify = require('./routes/spotify.js')
  var discord = require('./routes/discord.js')
  var desktop = require('./routes/desktop.js')
  var socket = require('./routes/sockets.js')(io)
  var fluxbulb = require('./routes/lights.js')  // controlling tp-link lightbulb from f.lux 
  var tasks = require('./routes/tasks.js')

  app.use(discord)
  app.use(socket)
  app.use(fluxbulb.router)

  // Set properties
  app.use(express.static(__dirname))
  app.use(bodyParser.json()); // For parsing application/json
  app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

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