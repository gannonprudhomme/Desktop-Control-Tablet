// Joins all of the socket connections into one

var handleDesktop = require('./desktop.js')
var handleSpotify = require('./spotify.js')
var handleLight = require('./lights.js')
var handleWeather = require('./weather.js')
var express = require('express')
var router = express.Router()

var returnRouter = function(io) {
  io.on('connection', function(socket) {
    handleDesktop.socketHandler(socket)
    handleSpotify.socketHandler(socket)
    handleLight.socketHandler(socket)
    handleWeather.socketHandler(socket)
  })

  return router
}

module.exports = returnRouter
