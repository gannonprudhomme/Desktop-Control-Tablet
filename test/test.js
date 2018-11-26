var expect = require('chai').expect
var commands = require('../routes/commands.js')
var fs = require('fs')
var desktop = require('../routes/desktop.js')
var io = require('socket.io-client')


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

describe('File Utils', function() {
})

describe('Server Route Testing', function() {
    var client

    it('Should connect to the server in 3 seconds', function(done) {
        var connected = false
        var options ={
            transports: ['websocket'],
            'force new connection': true
        };

        client = io.connect('http://192.168.1.78:3000', options)
        //client.open()
        
        client.on('connect', function(data) {
            //client.emit('play', '123')

            connected = true
            expect(connected).to.be.equal(true)
        })

        client.on('connect_error', (error) => {
            // Throw an error
            console.log('Connect error: ' + error)

            expect(client.connected).to.be.equal(true)
        })

        client.on('error', (error) => {
            // Throw an error
            console.log('General error: ' + error)

            expect(client.connected).to.be.equal(true)
        })

        client.on('connect_timeout', (timeout) => {
            // Throw an error
            console.log('Timeout ' + timeout)

            expect(client.connected).to.be.equal(true)
        })
        
        this.timeout(5000)
        setTimeout(function() {
            // console.log(client)
            expect(client.connected).to.be.equal(true)

            done()
        }, 3000)
    })

    
})

describe('addTwoNumbers', function() { // Creates a testing environment
    it('should add two numbers', function() { // Defines test cases which need to be passed
        // 1. Arrange
        var x = 5
        var y = 1
        var sum1 = x + y

        // 2. Act
        var sum2 = commands.addTwoNumbers(x, y)
        
        // 3. Assert
        expect(sum2).to.be.equal(sum1)
    })
})