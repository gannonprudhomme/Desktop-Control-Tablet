var expect = require('chai').expect
var assert = require('chai').assert
var fs = require('fs')
var io = require('socket.io-client')
var {exec} = require('child_process')

// Files to be tested
var commands = require('../routes/commands.js')
var desktop = require('../routes/desktop.js')

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
    var client
    
    it('Should connect to the servers', async function() {
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
    })
    
    // End the node server    
    // exec('pkill node')
})

/

describe('File Utils', function() {
})