var socket = io()

var module_settings = {} // Need to get the module settings

$(document).ready(function() {
    // Get the module settings from the server
    socket.emit('get_module_settings', 'light-control', function(data) {
        module_settings = data

        // Once we've retrieved the module data, initialize the color sliders
        // We have to wait, as we need to see what the range of the colors for the light are
        setLightSliders()

        getLightInfo()

        // Set power image, depending on the state of the light
        // $('#power-icon').
    })
})

// Update light info every 2 seconds
window.setInterval(function() {
    getLightInfo()
}, 2000)

function setLightSliders() {
    $('#light-brightness-slider').slider({
        value: 100,
        min: 0,
        max: 100,
        animate: "fast",
        orientation: "horizontal",
    
        slide: function(e, ui) {
            $('#light-brightness-label').text(ui.value + '%')
            setBrightness(ui.value)
        }
    })
    $('#light-brightness-label').text('00%')
    
    // set the min and max value depending on the f.lux range?
    $('#light-color-slider').slider({
        value: module_settings['maxColor'], // Set the default to the max color/far-right of the slider
        min: module_settings['minColor'],
        max: module_settings['maxColor'],
        animate: "fast",
        orientation: "horizontal",
    
        slide: function(e, ui) {
            $('#light-color-label').text(ui.value + 'k')
            setLightColor(ui.value)
        }
    })
    $('#light-color-label').text('2500k')
}

$('#power-icon').click(function() {
    togglePower()
})

function getLightInfo() {
    socket.emit('get_light_info', '', function(data) {
        console.log('Light info:')
        console.log(data)

        if(data['responding']) {
            $('#circle').css('background', '#2fe70a')
        } else {
            $('#circle').css('background', '#f00')
        }

        $('#light-brightness-slider').slider('value', data['brightness'])
        $('#light-brightness-label').text(data['brightness'] + '%')

        $('#light-color-slider').slider('value', data['color_temp'])
        $('#light-color-label').text(data['color_temp'] + 'k')
    })
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