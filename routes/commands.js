var {exec} = require('child_process')

function setVolume(program, name) {
  exec('nircmd true setappvolume ' + program + ' ' + volume)
}

function sendKeypress(keys) {
  exec('nircmd sendkeypress ' + keys)
}

module.exports.setVolume = setVolume
module.exports.sendKeypress = sendKeypress
