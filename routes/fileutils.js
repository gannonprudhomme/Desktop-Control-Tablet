var fs = require('fs')

function saveVolumeData(volumeData) {
  var now = (new Date()).getTime()

  fs.writeFile('./public/volumeData.json', JSON.stringify(volumeData), function (error) {
    if (error)
      console.log(error)
  })
}

function loadVolumeData() {
  // Fill the volume map with all of the previous data here
  // Doesn't need to be asynchronous
  return JSON.parse(fs.readFileSync('./public/volumeData.json', 'utf-8'))
}

module.exports.loadVolumeData = loadVolumeData
module.exports.saveVolumeData = saveVolumeData