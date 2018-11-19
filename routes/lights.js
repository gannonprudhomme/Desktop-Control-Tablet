// Based off of https://github.com/ToXIc-Dev/flux-tplink-smart-bulbs
const express = require('express')
const router = express.Router()
const fs = require('fs')

// Delay for the light state change transition
const transition = 50

var module_settings = JSON.parse(fs.readFileSync('./public/views/modules/light-control.json'))
var bip = module_settings['ip'];  // Enter the bulbs IP - You can find this using your router or the scan command on Konsumer's tplink-lightbulb API.

var TPLSmartDevice = require('tplink-lightbulb')
var bulb = new TPLSmartDevice(bip);

var lightData = {'power': false, 'brightness': 0, 'color_temp': 2500}

// If the light has currently responded in the last X seconds
// Set to false before sending a call to the smart-bulb, then if it is set to true
// at the end of the timeout call, then we don't change the color of the connection status indicator
// var lightResponding = false

// On launch, retrieve the light info and set it into lightData
bulb.info().then(info => {
    var light_state = info['light_state']
    lightData['power'] = light_state['on_off']
    lightData['brightness'] = light_state['brightness']
    lightData['color_temp'] = light_state['color_temp']
})

var socketHandler = function(socket) {
    var _lightWasResponding = false // TODO Review the use/necessity of this

    socket.on('get_light_info', function(data, ret) {
        // Retrieve the light info from the bulb itself
        var lightResponding = false

        bulb.info().then(info => {
            if(!_lightWasResponding) {
                //console.log('Light now responding!')
            }

            _lightWasResponding = true
            lightResponding = true

            var light_state = info['light_state']
            lightData['power'] = light_state['on_off']

            // If the light isn't on
            if(!lightData['power']) {
                // Then the light data is going to be located in data.light_state.dft_on_state 
                // instead of data.light_state
                light_state = light_state['dft_on_state']
            }

            lightData['brightness'] = light_state['brightness']
            lightData['color_temp'] = light_state['color_temp']
            lightData['responding'] = lightResponding // which will always be set to true at this point

            ret(lightData)
        }).catch(error => {
            console.log(error)
        })

        // Timeout the function if the light isn't currently responding
        setTimeout(function() {
            // If lightResponding hasn't been set to true at this point, 
            // then it means the smart-bulb's info() callback hasn't triggered yet
            if(!lightResponding) {
                if(_lightWasResponding) {
                    //console.log('Light stopped responding!')
                }

                lightData['responding'] = false
                _lightWasResponding = false
                
                ret(lightData)
            }
        }, 200) // Typical light delay on a TP-LINK LB120 was average ~20ms, while 99%th percentile were 90-150ms
    })

    socket.on('set_light_brightness', function(data) {
        //console.log('Setting brightness to ' + data)

        var now = (new Date()).getTime()
        
        bulb.power(lightData['power'], transition, {brightness: data}).then(status => {
            //console.log(status)

            var delay = (new Date()).getTime() - now

            //console.log('Brightness delay: ' + delay)
        })
    })

    socket.on('set_light_color', function(data) {
        //console.log('Setting color to ' + data + 'k')
        bulb.power(lightData['power'], transition, {color_temp: data}).then(status => {
            //console.log(status)
        })
    })

    socket.on('toggle_light_power', function(data) {
        lightData['power'] = !lightData['power']

        //console.log('Changing light power to: ' + lightData['power'])

        bulb.power(lightData['power']).then(status => {
            //console.log(status)
        })
    })
}

// Handle flux changes to update the lightbulb
router.post('/flux', (req, res) => {
    // Parse the data from f.lux
    var temp = parseInt(req.query['ct'], 10);

    // Clamp the temperature to the range of the TPLink bulb
    var ctmp;
    if (temp < module_settings['minColor']) {
        ctmp = module_settings['minColor'];

    } else if (temp > module_settings['maxColor']) {
        ctmp = module_settings['maxColor'];

    } else {
        ctmp = temp;
    }
    
    //console.log('Changing Light to temperature ' + ctmp + 'k')
    
    // Create the bulb object
    bulb = new TPLSmartDevice(bip);

    lightData['color_temp'] = ctmp

    // Transition period of 500ms
    bulb.power(lightData['power'], 500, { color_temp: ctmp })
        .then(status => {
            //console.log(status)
        })
        .catch(err => console.error(err))

    // Send the response back to f.lux? Not sure if this is necessary
    res.end(JSON.stringify(req.query));
})

module.exports.socketHandler = socketHandler
module.exports.router = router;