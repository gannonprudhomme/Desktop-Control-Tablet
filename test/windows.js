/**
 * Tests that should only be on the Windows host/home computer
 * As it tests generic windows stuff, and often requires nircmd to be installed
 */
var isWin = process.platform === "win32"

if(isWin) {


var expect = require('chai').expect
var assert = require('chai').assert
var {exec} = require('child_process')
var tasks = require('../routes/tasks.js')
var io = require('socket.io-client')

describe('Tasks Testing', function() {
    describe('Reading Command output', function() {
        it('Should read echo correctly', function() {
            
        })
    })
        
    describe('Loading task list', function() {
        it('Should have System Process (on Windows)', async function() {
            return tasks.loadTaskList().then(taskMap => {
                expect(taskMap.has('System')).to.be.equal(true)
            })
        })

        it('Should have Registry (on Windows)', async function() {
            return tasks.loadTaskList().then(taskMap => {
                expect(taskMap.has('Registry')).to.be.equal(true)
            })
        })
    })
})

describe('Desktop Route Testing', function() {
    var client

    before(async function() {
        // exec('node app.js') // Start the server

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

    describe('Active Programs Endpoint', function(done) {
        it('Should work', async function() {
            var programs = ['chrome.exe']

            return new Promise((resolve, reject) => {
                client.emit('active_programs', programs, (data) => {
                    if(data) {
                        resolve()
                    } else { // Might not ever be called?
                        reject()
                    }
                })
            })
        })
    })

    // Afterwards, kill the server
    after(function(){
        // If this is the home pc, don't kill the node server process
        // If it is, kill it, as the Travis-CI build will hold
        var is_home = process.env.IS_HOME

        // If the environmental variable exists
        if(is_home) {
            if(is_home === 'NO') {
                exec('TASKKILL /F /IM node.exe')
            }
        }
    })
})

}