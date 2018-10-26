var express = require('express')
var {exec} = require('child_process')
var path = require('path')
var fs = require('fs')

var router = express.Router()

var volumes = {};
var volumeData = JSON.parse(fs.readFileSync(path.join(__dirname + '/public/volumeData.json'), 'utf-8'))

router.put('/desktop/sleep', (req, res) => {
  console.log('attempting to sleep')
  exec('nircmd standby')
})

/*
// ******** VOLUME ********
// This should probs be a PUT call instead
router.post('/volume', (req, res) => {
  //res.send("got a post request");
  console.log(req.body)
  res.send("Received package!")

  //volumes[req.body.program] = req.body.volume;
  volumeData[req.body.program] = req.body.volume;
  saveVolumeData();

  changeVolume(req.body.program, req.body.volume)
})

router.get('/volume/data', (req, res) => {
  res.send(volumeData);
  console.log("Sent volume data")
})

// Volume stuff
function changeVolume(programName, volume) {
  exec('nircmd true setappvolume ' + programName + ' ' + volume)
}

// Write the volume data to the file
function saveVolumeData() {
  fs.writeFile(path.join(__dirname + '/public/volumeData.json'), JSON.stringify(volumeData), function(error) {
    if(error)
      console.log(error)
  })
}
*/
module.exports = router;
