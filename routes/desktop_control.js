var express = require('express')
var {exec} = require('child_process')
var path = require('path')
var fs = require('fs')
var multer = require('multer') // for parsing multipart/form-data
var bodyParser = require('body-parser') // for parsing basic request data?

var router = express.Router()
router.use(bodyParser.json()); // For parsing application/json
router.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

var volumes = {};
var volumeData = JSON.parse(fs.readFileSync('./public/volumeData.json', 'utf-8'))

router.put('/desktop/sleep', (req, res) => {
  console.log('attempting to sleep')
  exec('nircmd standby')
})

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

var {exec} = require('child_process')
function changeVolume(programName, volume) {
  exec('nircmd true setappvolume ' + programName + ' ' + volume)
}

// Write the volume data to the file
function saveVolumeData() {
  fs.writeFile('./public/volumeData.json', JSON.stringify(volumeData), function(error) {
    if(error)
      console.log(error)
  })
}

function loadVolumeData() {
  // Fill the volume map with all of the previous data here
  // Doesn't need to be asynchronous
  volumeData = JSON.parse(fs.readFileSync('./public/volumeData.json', 'utf-8'))

  // Iterate over all of the keys(programs) in the json object
  // And add them to the local map
  for(key in volumeData) {
    volumes[key] = volumeData[key];
  }
}


module.exports.router = router;
module.exports.loadVolumeData = loadVolumeData;
