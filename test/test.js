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
    
    it('Should connect to the server in 3 seconds', function(done) {
        var error = false
        var options ={
            transports: ['websocket'],
            'force new connection': true
        };
        
        client = io.connect('http://localhost:3000', options)
        //client.open()
        
        client.on('connect', function(data) {
            //client.emit('play', '123')
            
            expect(true).to.be.equal(true)
            done()
        })
        
        client.on('connect_error', (error) => {
            // Throw an error
            console.log('Connect error: ' + error)
            
            expect(client.connected).to.be.equal(true)
            done()
        })
        
        client.on('error', (error) => {
            // Throw an error
            console.log('General error: ' + error)
            
            expect(client.connected).to.be.equal(true)
            done()
        })
        
        client.on('connect_timeout', (timeout) => {
            // Throw an error
            console.log('Timeout ' + timeout)
            
            expect(client.connected).to.be.equal(true)
            done()
        })
        
        /*this.timeout(5000)
        setTimeout(function() {
            // console.log(client)
            
            done()
        }, 3000) */
    })
    
    // End the node server    
    exec('pkill node')
})

/

describe('File Utils', function() {
})