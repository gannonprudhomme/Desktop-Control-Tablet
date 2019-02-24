const expect = require('chai').expect
const assert = require('chai').assert
const fs = require('fs')
const io = require('socket.io-client')
const {exec} = require('child_process')

// Files to be tested
const commands = require('../server/commands.js')
const desktop = require('../server/routes/desktop.js')

describe('Desktop Route Testing', function() {
  describe('importVolumeData()', function() {
    it('Should load it in correctly', function() {

    })
  })

  describe('getPerformanceUsage', function() {

  })

  describe('getModuleSettings', function() {

  })
})


describe('Server Route Testing', function() {
  let client

  /* it('Should connect to the servers', async function() {
    return new Promise((resolve, reject) => {
      client = io.connect('http://localhost:3000')

      client.on('connect', (data) => {
        resolve()
      })

      client.on('connect_error', (error) => {
        reject(error)
      })

      client.on('error', (error) => {
        reject(error)
      })

      client.on('connect_timeout', (timeout) => {
        reject(timeout)
      })
    })
  }) */
  // End the node server    
  // exec('pkill node')
})

/

describe('File Utils', function() {
})
