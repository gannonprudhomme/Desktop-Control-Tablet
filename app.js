const express = require('express')
const multer = require('multer') // for parsing multipart/form-data
const bodyParser = require('body-parser') // for parsing basic request data?
const path = require('path')
var fs = require('fs')
// var mongodb = require('mongodb')
// var mongoose = require('mongoose')

const app = express()
const port = 3000
var upload = multer()

// Have a local instance of the volume and (eventually) only saving it on change
var volumes = {};
var volumeData = JSON.parse(fs.readFileSync(path.join(__dirname + '/public/volumeData.json'), 'utf-8'))

// Set properties
app.use(express.static(__dirname))
app.use(bodyParser.json()); // For parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

/*
mongoose.connect('mongodb://192.168.1.78/database', {useNewUrlParser: true})
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  // Connected
})

var Schema = mongoose.Schema
var sliderModel = new Schema({
  programName: String,
  volume: Number
}) */

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://192.168.1.78:3000');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET');

  next();
})

// app.use(express.static(__dirname + '/public/'))

app.get('/tablet', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/tablet/index.html'))
})

app.get('/mobile', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/mobile/control.html'))
})

// Handle REST calls
app.get('/', (req, res) => {


})

app.post('/volume', (req, res) => {
  //res.send("got a post request");
  console.log(req.body)
  res.send("Received package!")

  //volumes[req.body.program] = req.body.volume;
  volumeData[req.body.program] = req.body.volume;
  saveVolumeData();

  changeVolume(req.body.program, req.body.volume)
})

app.get('/volume/data', (req, res) => {
  res.send(volumeData);
  console.log("Sent volume data")
})

// Listen to this port, and handle any errors accordingly
app.listen(port, (err) => {
  if(err) {
    return console.log("something bad happened", err)
  }

  console.log(`server is listening on ${port}`)

  // Fill the volume map with all of the previous data here
  // Doesn't need to be asynchronous
  var volumeData = JSON.parse(fs.readFileSync(path.join(__dirname + '/public/volumeData.json'), 'utf-8'))

  // Iterate over all of the keys(programs) in the json object
  // And add them to the local map
  for(key in volumeData) {
    volumes[key] = volumeData[key];
  }
})

var {exec} = require('child_process')
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

// Save the JSON when we close

/*
serverUp = true;
process.stdin.resume(); // So the program will not close immediately
function exitHandler(options, err) {
    saveVolumeData();
    if(!serverUp){return;}
    serverUp = false;
    console.log("debug");
    process.exit();   // Don't think you'll need this line any more
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
*/
