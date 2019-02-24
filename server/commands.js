const fs = require('fs')

const stream = fs.createWriteStream('delays.txt', {flags: 'a'})

function saveDelay(time) {
  stream.write(time + '\n')
}

module.exports.saveDelay = saveDelay
