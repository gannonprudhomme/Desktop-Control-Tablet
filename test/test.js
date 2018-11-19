var expect = require('chai').expect
var commands = require('../routes/commands.js')

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