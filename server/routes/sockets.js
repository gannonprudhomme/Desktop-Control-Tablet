// Joins all of the socket connections into one
const express = require('express')
const router = express.Router()

// Handles all of the socket endpoints
class SocketHandler {
  constructor(routers) {
    this.routers = routers
  }

  returnRouter(io) {
    io.on('connection', (socket) => {
      // Call all of the routers' socketHandler functions
      for(let i = 0; i < this.routers.length; i++) {
        const route = this.routers[i]

        // TODO: Do i need to add a vailidity check here?
        route.socketHandler(i)
      }
    })
  }
}

module.exports = SocketHandler
