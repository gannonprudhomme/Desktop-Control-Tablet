var {exec} = require('child_process')
var fs = require('fs')

var stream = fs.createWriteStream('delays.txt', {flags:'a'})
function saveDelay(time) {
  stream.write(time + '\n')
}

module.exports.saveDelay = saveDelay