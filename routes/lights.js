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

var lightData = {'power': false, 'brightness': 0, 'color_temp': 6500}

// On launch, retrieve the light info and set it into lightData
bulb.info().then(info => {
    var light_state = info['light_state']
    lightData['power'] = light_state['on_off']
    lightData['brightness'] = light_state['brightness']
    lightData['color_temp'] = light_state['color_temp']
})

var socketHandler = function(socket) {
    socket.on('get_light_info', function(data, ret) {
        // Retrieve the light info from the bulb itself
        bulb.info().then(info => {
            var light_state = info['light_state']
            lightData['power'] = light_state['on_off']
            lightData['brightness'] = light_state['brightness']
            lightData['color_temp'] = light_state['color_temp']

            ret(lightData)
        })
    })

    socket.on('set_light_brightness', function(data) {
        console.log('Setting brightness to ' + data)
        
        bulb.power(lightData['power'], transition, {brightness: data}).then(status => {
            //console.log(status)
        })
    })

    socket.on('set_light_color', function(data) {
        console.log('Setting color to ' + data)
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
    if (temp < 2500) {
        ctmp = 2500;

    } else if (temp > 6500) {
        ctmp = 6500;

    } else {
        ctmp = temp;
    }
    
    console.log('Changing Light to temperature ' + ctmp + 'k')
    
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