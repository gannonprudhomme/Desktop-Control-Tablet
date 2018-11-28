var {exec} = require('child_process')
var fs = require('fs')

function setVolume(program, volume) {
  if(program === 'master-volume') {
    // Set the master volume
    // Save the separate volumes for each sound device? So my soundbar doesn't blast music super loud
    exec('nircmd setvolume 0 ' + parseInt(volume * 65535) + ' ' + parseInt(volume * 65535))

  } else {
    exec('nircmd true setappvolume ' + program + ' ' + volume)
  }
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

function addTwoNumbers(a, b) {
  return a+b
}

module.exports.addTwoNumbers = addTwoNumbers
module.exports.setVolume = setVolume
module.exports.sendKeypress = sendKeypress
module.exports.saveDelay = saveDelay
module.exports.changeAudioOutput = changeAudioOutput