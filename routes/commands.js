var {exec} = require('child_process')
var fs = require('fs')

function setVolume(program, name) {
  exec('nircmd true setappvolume ' + program + ' ' + volume)
}

function sendKeypress(keys) {
  exec('nircmd sendkeypress ' + keys)
}

function changeAudioOutput(device) {
  exec('nircmd setdefaultsounddevice \"' + device + '\"')
}

var stream = fs.createWriteStream('delays.txt', {flags:'a'})
function saveDelay(time) {
  stream.write(time + '\n')
}

module.exports.setVolume = setVolume
module.exports.sendKeypress = sendKeypress
module.exports.saveDelay = saveDelay
module.exports.changeAudioOutput = changeAudioOutput
