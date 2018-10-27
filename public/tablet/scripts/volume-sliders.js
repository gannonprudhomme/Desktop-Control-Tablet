var volumes = {"master-volume":0, "spotify.exe": 0, "discord.exe": 0, "rocketleague.exe": 0, "chrome.exe": 0}

var socket = io()

$(document).ready(function() {
  getVolumeData()
})

$(document.body).on("touchmove", function(event) {
    event.preventDefault();
    event.stopPropagation();


});

function setSliders() {
  $("#master-volume-slider").slider({
      value: volumes["master-volume"] * 100,
      min: 0,
      max: 100,
      animate: "fast",
      orientation: "horizontal",

      slide: function(e, ui) {
        var output = jQuery('#mater-volume-label')
        output.text(ui.value + "%")
        // sendVolumeData('master-volume', ui.value / 100)
      }
    });

  $("#spotify-slider").slider({
      value: volumes["spotify.exe"] * 100,
      min: 0,
      max: 100,
      animate: "fast",
      orientation: "horizontal",

      slide: function(e, ui) {
        var output = jQuery('#spotify-label')
        output.text(ui.value + "%")
        sendVolumeData('spotify.exe', ui.value / 100)
      }
  });

  $("#discord-slider").slider({
    value: volumes["discord.exe"] * 100,
    min: 0,
    max: 100,
    animate: "fast",
    orientation: "horizontal",

    slide: function(e, ui) {
      var output = jQuery('#discord-label')
      output.text(ui.value + "%")
      sendVolumeData('discord.exe', ui.value / 100)
    }
  });

  $("#rocketleague-slider").slider({
    value: volumes["rocketleague.exe"] * 100,
    min: 0,
    max: 100,
    animate: "fast",
    orientation: "horizontal",

    slide: function(e, ui) {
      var output = jQuery('#rocketleague-label')
      output.text(ui.value + "%")
      sendVolumeData('rocketleague.exe', ui.value / 100)
    }
  });

  $("#chrome-slider").slider({
    value: volumes["chrome.exe"] * 100,
    min: 0,
    max: 100,
    animate: "fast",
    orientation: "horizontal",

    slide: function(e, ui) {
      var output = jQuery('#chrome-label')
      output.text(ui.value + "%")
      sendVolumeData('chrome.exe', ui.value / 100)
    }
  });

  // $('#master-volume-label').text((volumes["master-volume"] * 100) + "%")
  $('#spotify-label').text(Math.floor(volumes["spotify.exe"] * 100) + "%")
  $("#discord-label").text(Math.floor(volumes["discord.exe"] * 100) + "%")
  $("#rocketleague-label").text(Math.floor(volumes["rocketleague.exe"] * 100) + "%")
  $('#chrome-label').text(Math.floor(volumes["chrome.exe"] * 100) + "%")
}

function sendVolumeData(program, volume) {
  var obj = {
    program: program,
    volume: volume,
    time: (new Date()).getTime()
  }

  console.log('sending volume')
  socket.emit('set_volume', obj)
}

function getVolumeData() {
  socket.emit('volume_data', '', function(data) {
    // console.log(data)

    volumes["spotify.exe"] = data["spotify.exe"]
    volumes["discord.exe"] = data["discord.exe"]
    volumes["rocketleague.exe"] = data["rocketleague.exe"]
    volumes["chrome.exe"] = data["chrome.exe"]

    setSliders()

    // console.log(volumes)
  })
}

/*function sendVolumeData(programName, volume) {
  var instance = axios.create({
    baseURL: 'http://192.168.1.78:3000/volume',
    timeout: 3000
  })

  instance.post('', {
    program: programName,
    volume: volume
  }).then(function(response) {
    if(response) { console.log(response) }
  }).catch(function(error) {
    console.log(error)
  })
}

function getVolumeData() {
  var instance = axios.create({
    baseURL: 'http://192.168.1.78:3000/volume/data',
    timeout: 3000,
  })

  instance.get('', {
  }).then(function(response) {
    //console.log(response.data)

    // volumes["master-volume"] = response.data["master-volume"]
    volumes["spotify.exe"] = response.data["spotify.exe"]
    volumes["discord.exe"] = response.data["discord.exe"]
    volumes["rocketleague.exe"] = response.data["rocketleague.exe"]
    volumes["chrome.exe"] = response.data["chrome.exe"]

    setSliders()

    console.log(volumes)

  }).catch(function(error) {
    console.log(error)
  })
}*/
