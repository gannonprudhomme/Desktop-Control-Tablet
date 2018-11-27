/**
 * Tests that should only be on the Windows host/home computer
 * As it tests generic windows stuff, and often requires nircmd to be installed
 */
var isWin = process.platform === "win32"

if(isWin) {

    
var expect = require('chai').expect
var assert = require('chai').assert
var tasks = require('../routes/tasks.js')

describe('Tasks Testing', function() {
    describe('Reading Command output', function() {
        it('Should read echo correctly', function() {
            
        })
    })

    describe('Loading task list', function() {
        it('Should have System Process (on Windows)', async function() {
            return tasks.loadTaskList().then(taskMap => {
                expect(isKeyInMap(taskMap, 'System')).to.be.equal(true)
            })
        })

        it('Should have Registry (on Windows)', async function() {
            return tasks.loadTaskList().then(taskMap => {
                expect(isKeyInMap(taskMap, 'Registry')).to.be.equal(true)
            })
        })
    })
})

// Helper function for testing if a key is within a map's list of keys
function isKeyInMap(map, key) {
    for(var k of map.keys()) {
        if(key === k) {
            return true
        }
    }

    return false
}


}