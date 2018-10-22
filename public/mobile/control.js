var volumes = {"spotify.exe": 0, "discord.exe": 0, "rocketleague.exe": 0} // Initial volumes
var ip = "192.168.1.78" //
// var ip = "10.34.16.187"


$(document).ready(function() {
  var spotify = $('#spotify-slider')
  var discord = $("#discord-slider")




})


$(document.body).on("touchmove", function(event) {
    event.preventDefault();
    event.stopPropagation();


});

$(function() {
  console.log(volumes)

  var instance = axios.create({
    baseURL: 'http://' + ip + ':3000/volume/data',
    timeout: 3000,
    headers: {'X-Custom-Header': 'foobar'}
  })

  instance.get('', {
    params: {
      // Do i need to put something in here?
    }
  }).then(function(response) {
    //console.log(response.data)

    volumes["spotify.exe"] = response.data["spotify.exe"]
    volumes["discord.exe"] = response.data["discord.exe"]
    volumes["rocketleague.exe"] = response.data["rocketleague.exe"]

    console.log(volumes)

    setSliders()


  }).catch(function(error) {
    console.log(error)
  })
})

function setSliders() {
  $("#spotify-slider").slider({
    value: volumes["spotify.exe"] * 100,
    min: 0,
    max: 100,
    animate: "fast",
    orientation: "vertical",

    slide: function(e, ui) {
      var output = jQuery('#spotify-label')
      output.text(ui.value + "%")
      doStuff('spotify.exe', ui.value / 100);
    }
  });

  $("#discord-slider").slider({
    value: volumes["discord.exe"] * 100,
    min: 0,
    max: 100,
    animate: "fast",
    orientation: "vertical",

    slide: function(e, ui) {
      var output = jQuery('#discord-label')
      output.text(ui.value + "%")
      doStuff('discord.exe', ui.value / 100);
    }
  });

  $("#rocketleague-slider").slider({
    value: volumes["rocketleague.exe"] * 100,
    min: 0,
    max: 100,
    animate: "fast",
    orientation: "vertical",

    slide: function(e, ui) {
      var output = jQuery('#rocketleague-label')
      output.text(ui.value + "%")
      doStuff('rocketleague.exe', ui.value / 100);
    }
  });

  // Set the slider label values
  $('#spotify-label').text((volumes["spotify.exe"] * 100) + "%")
  $("#discord-label").text((volumes["discord.exe"] * 100) + "%")
  $("#rocketleague-label").text((volumes["rocketleague.exe"] * 100) + "%")

}


function doStuff(program, value) {
  console.log(value);

  // Program name needs to be gotten by the slider id or something
  // sendPostRequest('spotify.exe', slider.val() / slider.attr('max'))
  sendPostRequest(program, value)
}


// Send a post request to change the volume to the server
function sendPostRequest(programName, vol) {
  var instance = axios.create({
    baseURL: 'http://' + ip + ':3000/volume',
    timeout: 3000,
    headers: {'X-Custom-Header': 'foobar'}
  })

  instance.post('', {
    program: programName,
    volume: vol
  }).then(function(response) {
    //console.log(response.data);
  }).catch(function(error) {
    console.log(error);
  })
}
function getRequest(programName) {}

// Return the previously set volume from the Node.JS server(desktop)
/*
function setVolumeData() {
  var instance = axios.create({
    baseURL: 'http://192.168.1.78:3000/volume/data',
    timeout: 3000,
    headers: {'X-Custom-Header': 'foobar'}
  })

  instance.get('', {
    params: {

    }
  }).then(function(response) {
    //console.log(response.data)

    volumes["spotify.exe"] = response.data["spotify.exe"]
    volumes["discord.exe"] = response.data["discord.exe"]

    console.log(volumes)

    $("#spotify-slider").val(response.data["spotify.exe"] * 100)
    $("#discord-slider").val(response.data["dicord.exe"] * 100)
  }).catch(function(error) {
    console.log(error)
  })
} */

/*
// Stops sending after {7} tries
// Fixes back to the last value? when you refresh
function sendPostRequestOld(programName, vol) {
  console.log(vol);
  const data = {
    program: programName,
    volume: vol
  }

  //console.log('sending post request')
  $.post("http://192.168.1.78:3000/volume", data, function(incomingData, status) {
    console.log(`${incomingData} and status is ${status}`)
  })
}
*/
