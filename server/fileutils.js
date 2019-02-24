const fs = require('fs')

class FileUtils {
  constructor() {
  }

  static saveVolumeData(volumeData) {
    const now = (new Date()).getTime()

    fs.writeFile('./public/volumeData.json', JSON.stringify(volumeData), (error) => {
      if(error) {
        console.log(error)
      }
    })
  }

  static loadVolumeData() {
    return JSON.parse(fs.readFileSync('./public/volumeData.json', 'utf-8'))
  }
}

module.exports = FileUtils
