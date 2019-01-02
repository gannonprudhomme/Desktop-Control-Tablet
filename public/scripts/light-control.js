var socket = io()

var module_settings = {} // Need to get the module settings
var lights = {} // Array of all of the current lights, also include all lights data?

// Compared to the current time when potentially old light data would change the
// sliders back to their previous position
var lastBrightnessChange = 0
var lastColorChange = 0

// Set to the current time when we first receieve data about the light not responding
var lightTimeout = 0

// If we've reconnected since when we most-recently timed-out
var reconnected = false

var currentLightID = 'all-lights'

$(document).ready(function() {
    // Get the module settings from the server
    socket.emit('get_module_settings', 'light-control', function(data) {
        module_settings = data
        lights = module_settings['lights']

        // Once we've retrieved the module data, initialize the color sliders
        // We have to wait, as we need to see what the range of the colors for the light are
        setLightSliders()

        getLightInfo()

        // Hide all of the lights, and show the all lights selector
        switchToLightPage('Desk-Lamp')

        // Set the switch buttons' according text
        setLightSwitchButtons()

        // Set power image, depending on the state of the light
        // $('#power-icon').
    })

    // Hide the timeout timer
    $('#timeout-container').hide()
})

// Update light info every 2 seconds
window.setInterval(function() {
    getLightInfo()
}, 500)

function setLightSliders() {
    // Iterate over all of the lights 
    for(var i in module_settings['lights']) {

    }

    $('#light-brightness-slider').slider({
        value: 100, // 100%
        min: 0, // 0%
        max: 100, // 100%
        animate: "fast", // Animation speed, fast so it feels more responsive
        orientation: "horizontal",
    
        slide: function(e, ui) {
            $('#light-brightness-label').text(ui.value + '%')
            setBrightness(ui.value)

            // Set the current to time in milliseconds
            // Compared to the current time when potentially old light data would change the
            // sliders back to their previous position
            lastBrightnessChange = (new Date()).getTime()
        }
    })
    $('#light-brightness-label').text('00%')
    
    // set the min and max value depending on the f.lux range?
    $('#light-color-slider').slider({
        value: module_settings['maxColor'], // Set the default to the max color/far-right of the slider
        min: module_settings['minColor'], // the minimum color-temperature value of the light bulb
        max: module_settings['maxColor'], // ^
        animate: "fast", // Animation speed, fast so it feels more responsive
        orientation: "horizontal",
    
        slide: function(e, ui) {
            $('#light-color-label').text(ui.value + 'k')
            setLightColor(ui.value)

            // Set the current to time in milliseconds
            // Compared to the current time when potentially old light data would change the
            // sliders back to their previous position
            lastColorChange = (new Date()).getTime()

        }
    })
    $('#light-color-label').text('2500k')
}

// Add a click handler for all of the light-switcher-icon objects
$(".light-switcher-icon").on('click', function(event){
    event.stopPropagation();
    event.stopImmediatePropagation();
    //(... rest of your JS code)

    var lightID = event.target.id
    console.log(lightID + ' Click')
    // Get the substring for the actual lightID and switch to it
    //switchToLightPage(lightID)
});

// Set the switch buttons' according text
function setLightSwitchButtons() {

    // Set all button
    $('#all-lights-switcher-icon').click(function() {
        switchToLightPage('all-lights')
    })

    // Iterate over all of the lights
    for(var i in lights) {
        var light = lights[i]
        var id = light['id']

        console.log('Setting ' + '#' + id + '-switcher-label')
        // Set the text for  them
        $('#' + id + '-switcher-label').val(id)
    }
}

// When the power icon is clicked, send a socket message to toggle it
$('#power-icon').click(function() {
    togglePower()
})

function getLightInfo() {
    // Iterate over the lights from module settings
    // Should this receieve an array of all of the data for the lights? Or should we send them individually
    // Probs indidiually, as the lights will respond at different speeds
    for(var i in lights) {
        var light = lights[i]

        // Check if the light has an ID
        // If not, throw an error?

        // Retrieve the current information for this light
        socket.emit('get_light_info', light['id'], function(data) {
            var now = (new Date()).getTime()
    
            // If the light is currently responding
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
    
                var diff = now - lightTimeout
    
                // The current timeout either milliseconds, seconds, or minutes
                var timeoutText = ""
    
                if(diff < 60000) { // If its less than a minute
                    timeoutText = parseInt(diff / 1000) + 'sec(s)'
    
                } else {
                    timeoutText = parseInt(diff / 60000) + 'min(s)'
                }
    
                $('#light-timeout').text('Timeout: ' + timeoutText)
    
                reconnected = false
            }

            // Check if the bulb is LIFX or TP-Link
    
            if(now - lastBrightnessChange > 2000) {
                $('#light-brightness-slider').slider('value', data['brightness'])
                $('#light-brightness-label').text(data['brightness'] + '%')
    
            } else {
                console.log('Old(?) Brightness Data Rejected: ' + data['brightness'])
            }
    
            // Prioritize the data from the light,
            $('#light-color-slider').slider('value', data['color_temp'])
            $('#light-color-label').text(data['color_temp'] + 'k')
        })
    }
}

// Can swap between any of the lights, or access all of them
function switchToLightPage(lightID) {
    console.log('Switching light to ' + lightID)
    if(light == 'all-lights') { // If we're trying to switch to all lights
        // Hide all of the other lights

        // Show the all light selector page
    } else {
        $('#all-lights').hide()
    }
    

    // Hide all of the lights that aren't lightID 
    for(var i in lights) {
        var light = lights[i]

        // If this light isn't the light page we're trying to show
        if(light['id'] != lightID) { 
            // Hide it
            $('#' + light['id']).hide()
        }
    }

    $('#' + lightID).show()
}

function togglePower() {
    socket.emit('toggle_light_power', '')
}

// Set the brightness color
function setBrightness(brightness) {
    socket.emit('set_light_brightness', brightness)
}

// Set the light color
function setLightColor(color) {
    socket.emit('set_light_color', color)
}