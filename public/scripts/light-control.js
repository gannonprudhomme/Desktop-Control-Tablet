// const socket = require('socket.io-client')('http://localhost:3000')

let moduleSettings = {} // Need to get the module settings
let lights = {} // Array of all of the current lights, also include all lights data?
let allLightsData = {}

// Compared to the current time when potentially old light data would change the
// sliders back to their previous position
const lightsLastChange = {
  'all-lights': {
    'brightness': 0,
    'color_temp': 0,
  },
}

// Set to the current time when we first receieve data about the light not responding
let lightTimeout = 0

// If we've reconnected since when we most-recently timed-out
let reconnected = false

const selectedLightColor = '#00C8C8'
const deselectedLightColor = '#fffff'

$(document).ready(function() {
  // Get the module settings from the server
  console.log('Light control: Atttempting to get module settings')
  socket.emit('get_module_settings', 'light-control', function(data) {
    console.log('Light control: Received module_settings')
    moduleSettings = data
    lights = moduleSettings['lights']

    // Initialize all lights data
    allLightsData = {
      'name': 'All Lights',
      'id': 'all-lights',
      'minColor': 2500, // largest min color
      'maxColor': 6500, // smallest max color
      'rgb': false,
      // no ip
      // no type
    }

    // Once we've retrieved the module data, initialize everything
    // We have to wait, as we need to see what the range of the colors for the light are

    setLightSlider(-1) // Set the sliders for the all-lights page

    // Set the sliders for the rest of the lights
    for(const i in lights) {
      if(Object.prototype.hasOwnProperty.call(lights, i)) {
        setLightSlider(i)
        getLightInfo(i)

        lightsLastChange[lights[i]['id']] = {
          'brightness': 0,
          'color': 0,
        }
      }
    }

    // Hide all of the lights, and show the all lights selector
    switchToLightPage('Desk-Lamp')

    // Set the switch buttons' according text
    // setLightSwitchButtons()

    // Set power image, depending on the state of the light
    // $('#power-icon').
  })

  // Hide the timeout timer
  $('#timeout-container').hide()
})

// Update light info every 2 seconds
window.setInterval(function() {
  for(const i in lights) {
    if(Object.prototype.hasOwnProperty.call(lights, i)) {
      getLightInfo(i)
    }
  }
}, 500)

// Set Index = -1 to access all-lights
function setLightSlider(index) {
  let lightData = {}
  if(index == -1) {
    lightData = allLightsData
  } else {
    lightData = lights[index]
  }

  // Set light brightness slider for this light
  $('#' + lightData['id'] + '-light-brightness-slider').slider({
    value: 100, // 100%
    min: 0, // 0%
    max: 100, // 100%
    animate: 'fast', // Animation speed, fast so it feels more responsive
    orientation: 'horizontal',

    slide: function(e, ui) {
      $('#' + lightData['id'] + '-light-brightness-label').text(ui.value + '%')
      setBrightness(lightData['id'], ui.value)

      // Set the current to time in milliseconds
      // Compared to the current time when potentially old light data would change the
      // sliders back to their previous position
      lightsLastChange[lightData['id']]['brightness'] = (new Date()).getTime()
    },
  })
  $('#' + lightData['id'] + '-light-brightness-label').text('100%')

  // set the min and max value depending on the f.lux range?
  $('#' + lightData['id'] + '-light-color-slider').slider({
    value: lightData['maxColor'], // Set the default to the max color/far-right of the slider
    min: lightData['minColor'], // the minimum color-temperature value of the light bulb
    max: lightData['maxColor'], // ^
    animate: 'fast', // Animation speed, fast so it feels more responsive
    orientation: 'horizontal',

    slide: function(e, ui) {
      $('#' + lightData['id'] + '-light-color-label').text(ui.value + 'k')
      setLightColor(lightData['id'], ui.value)

      // Set the current to time in milliseconds
      // Compared to the current time when potentially old light data would change the
      // sliders back to their previous position
      // lastColorChange = (new Date()).getTime()
    },
  })
  $('#' + lightData['id'] + '-light-color-label').text('2500k') // Set default color-label text

  // Set the RGB slider(s)
  if(lightData['rgb']) {

  }
}

// Add a click handler for all of the light-switcher-icon objects
$('.light-switcher-icon').on('click', function(event) {
  event.stopPropagation();
  event.stopImmediatePropagation();

  // Get the substring for the actual lightID and switch to it
  const id = event.target.id // Get the lightID+'-switcher-icon'
  const len = id.length;
  const lightID = id.substring(0, len - ('-switcher-icon').length) // Get the actual lightID
  console.log(lightID + ' Click')

  switchToLightPage(lightID)
});

// Set the switch buttons' according text
function setLightSwitchButtons() {
  // Set all button
  $('#all-lights-switcher-icon').click(function() {
    switchToLightPage('all-lights')
  })

  // Iterate over all of the lights
  for(const i in lights) {
    if(Object.prototype.hasOwnProperty.call(lights, i)) {
      const light = lights[i]
      const id = light['id']

      console.log('Setting ' + '#' + id + '-switcher-label')

      // Set the text for  them, might have to iterate over them
      $('#' + id + '-switcher-label').html(id)
    }
  }
}

// When the power icon is clicked, send a socket message to toggle it
$('#power-icon').click(function() {
  togglePower('all-lights')
})

function getLightInfo(index) {
  // Should this receieve an array of all of the data for the lights? Or should we send them individually
  // Probs indidiually, as the lights will respond at different speeds
  if(index < 0) { // Error checking
    return
  }

  const light = lights[index]

  // Check if the light has an ID
  // If not, throw an error?

  // Retrieve the current information for this light
  socket.emit('get_light_info', {'id': light['id']}, function(data) {
    const now = (new Date()).getTime()

    // If the light is currently responding, update the connection circle
    if(data['responding']) {
      $('#circle').css('background', '#2fe70a') // Set the connection indicator circle to green

      // Set the local variable to indicate we are (re)connected
      reconnected = true

      // Hide the connection-timeout indicator
      $('#timeout-container').hide()
    } else {
      $('#circle').css('background', '#f00')

      // If we were connected to the light on the last getLightInfo call
      if(reconnected) {
        // Start the light timeout timer and display it
        lightTimeout = (new Date()).getTime()

        $('#timeout-container').show()
      }

      const diff = now - lightTimeout

      // The current timeout either milliseconds, seconds, or minutes
      let timeoutText = ''

      if(diff < 60000) { // If its less than a minute
        timeoutText = parseInt(diff / 1000) + 'sec(s)'
      } else {
        timeoutText = parseInt(diff / 60000) + 'min(s)'
      }

      $('#light-timeout').text('Timeout: ' + timeoutText)

      reconnected = false
    }

    // Check if the bulb is LIFX or TP-Link

    if(now - lightsLastChange[light['id']]['brightness'] > 2000) {
      $('#' + light['id'] + '-light-brightness-slider').slider('value', data['brightness'])
      $('#' + light['id'] + '-light-brightness-label').text(data['brightness'] + '%')
    } else {
      console.log('Old(?) Brightness Data Rejected: ' + data['brightness'])
    }

    // console.log(data)

    // Prioritize the data from the light,
    $('#' + light['id'] + '-light-color-slider').slider('value', data['color_temp'])
    $('#' + light['id'] + '-light-color-label').text(data['color_temp'] + 'k')
  })
}

// Can swap between any of the lights, or access all of them
function switchToLightPage(lightID) {
  // console.log('Switching light to ' + lightID)
  if(lightID != 'all-lights') { // If we're trying to switch to all lights
    // console.log('Hiding #all-lights')

    $('#all-lights-switcher-label').css('color', deselectedLightColor)
    $('#all-lights').hide()
  }

  // Hide all of the lights that aren't lightID
  for(const i in lights) {
    if(Object.prototype.hasOwnProperty.call(lights, i)) {
      const light = lights[i]

      // If this light isn't the light page we're trying to show
      if(light['id'] != lightID) {
        // console.log('Hiding ' + '#' + light['id'])

        $('#' + light['id'] + '-switcher-label').css('color', deselectedLightColor)

        // Hide it
        $('#' + light['id']).hide()
      }
    }
  }

  // Show the selected light page
  $('#' + lightID).show()

  // Set the according label's color
  $('#' + lightID + '-switcher-label').css('color', selectedLightColor)
}

function togglePower(lightID) {
  socket.emit('toggle_light_power', lightID)
}

// Set the brightness color
function setBrightness(lightID, brightness) {
  if(lightID == 'all-lights') {
    // Update the rest of the lights

    // Iterate over all of the lights
    for(const i in lights) {
      if(Object.prototype.hasOwnProperty.call(lights, i)) {
        // And set the brightness for them
        socket.emit('set_light_brightness', {'id': lights[i]['id'], 'brightness': brightness})
      }
    }
  } else { // Send it for an individual light
    socket.emit('set_light_brightness', {'id': lightID, 'brightness': brightness})
  }
}

// Set the light color
function setLightColor(lightID, color) {
  if(lightID == 'all-lights') {
    // Update the rest of the lights
    // Iterate over all of the lights
    for(const i in lights) {
      if(Object.prototype.hasOwnProperty.call(lights, i)) {
        // And set the color temperature for them
        socket.emit('set_light_color', {'id': lights[i]['id'], 'color': color})
      }
    }
  } else { // Send it for an individual light
    socket.emit('set_light_color', {'id': lightID, 'color': color})
  }
}
