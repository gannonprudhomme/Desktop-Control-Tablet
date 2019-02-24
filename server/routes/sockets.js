// Joins all of the socket connections into one
const express = require('express')

// Handles all of the socket endpoints
class SocketHandler {
  constructor(routers) {
    this.routers = routers

    this.router = express.Router()
  }

  returnRouter(io) {
    io.on('connection', (socket) => {
      // Call all of the routers' socketHandler functions
      for(let i = 0; i < this.routers.length; i++) { // Iterate over all of the routers
        // TODO: Do i need to add a vailidity check here?
        this.routers[i].socketHandler(socket)
      }
    })

    return this.router
  }
}

module.exports = SocketHandler
