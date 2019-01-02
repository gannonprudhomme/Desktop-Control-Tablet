// Based off of https://github.com/ToXIc-Dev/flux-tplink-smart-bulbs
const express = require('express')
const router = express.Router()
const fs = require('fs')

// Delay for the light state change transition
const transition = 50

var module_settings = JSON.parse(fs.readFileSync('./public/views/modules/light-control.json'))
var lightsSettings = module_settings["lights"]

var TPLSmartDevice = require('tplink-lightbulb')

var LifxClient = require('node-lifx').Client
var lifx = new LifxClient()

var lightsData = {}
initLights()

// If the light has currently responded in the last X seconds
// Set to false before sending a call to the smart-bulb, then if it is set to true
// at the end of the timeout call, then we don't change the color of the connection status indicator
// var lightResponding = false

function initLights() {
    // These needs to be loaded in dynamically
    for(var i in lightsSettings) {
        var light = lightsSettings[i]
        var id = light['id']

        lightsData[id] = {
            'type': light['type'], // We need the type to know how to handle a light given its ID
            // 'ip': light['ip'], // We need the IP for matching LIFX bulbs 
            'power': false,
            'brightness': 0,
            'color_temp': light["minColor"],
        }

        if(light['type'] == 'tp-link') {
            // Initialize the TP-Link bulb object
            var bulb = new TPLSmartDevice(light['ip'])

            // And set it as an object in lightsData
            lightsData[id]['object'] = bulb
            
            // Get its current status
            bulb.info().then(info => {
                var light_state = info['light_state']

                lightsData[id]['power'] = light_state['on_off']
                lightsData[id]['brightness'] = light_state['brightness']
                lightsData[id]['color_temp'] = light_state['color_temp']

            }).catch((error) => {
                console.log(error)
            })

        } else if(light['type'] == 'lifx') {
            // Set temporary hue and saturation, we'll load its data outside of this for-loop
            lightsData[id]['hue'] = 0
            lightsData[id]['saturation'] = 0
        }
    }

    // On initialization of a new light
    lifx.on('light-new', function(light) {
        var lightID

        var lightIP = light.address
        // Check which light this is
        for(var i in lightsSettings) {
            var lightSetting = lightsSettings[i]
            
            // If this light has the IP for the initialized LIFX light
            if(lightIP == lightSetting['ip']) {
                lightID = lightSetting['id']
                break // End the for loop, we've found the according light
            }
        }

        // If we found the light
        if(lightID != null) {
            // Set the according light object
            lightsData[lightID]['object'] = light

            // Load its data
            getLifxInfo(light, lightID).then((lightData) => {

            }).catch((error) => {
                console.log(error)
            })

        } else { // Didn't find the light
            console.log("LIGHT-CONTROL ERROR, Couldn't find LIFX light with IP: " + lightIP)
        }
    })

    lifx.init()
}

var socketHandler = function(socket) {
    var _lightWasResponding = false // TODO Review the use/necessity of this

    socket.on('get_light_info', function(data, ret) {
        // Retrieve the light info from the bulb itself
        var lightID = data['id']
        
        var lightResponding = false

        // Get the type of the bulb
        var type = lightsData[lightID]['type']

        if(type == "tp-link") {
            var bulb = lightsData[lightID]["object"] // Load the respective TPLSmartDevice object

            bulb.info().then(info => {
                if(!_lightWasResponding) {
                    //console.log('Light now responding!')
                }
    
                _lightWasResponding = true
                lightResponding = true
    
                var light_state = info['light_state']
                lightsData[lightID]['power'] = light_state['on_off']
    
                // If the light isn't on
                if(!lightsData[lightID]['power']) {
                    // Then the light data is going to be located in data.light_state.dft_on_state 
                    // instead of data.light_state
                    light_state = light_state['dft_on_state']
                }
    
                // Update the light data dictionary
                lightsData[lightID]['brightness'] = light_state['brightness']
                lightsData[lightID]['color_temp'] = light_state['color_temp']
                lightsData[lightID]['responding'] = lightResponding // which will always be set to true at this point
    
                // Create the dictionary to be returned the client
                // We create this separately, as we don't need to send back the full data(like light type and its object)
                var retData = {
                    'brightness': light_state['brightness'],
                    'color_temp': light_state['color_temp'],
                    'responding': lightResponding
                }

                // Don't wanna send the light object or anything
                ret(retData)
            }).catch(error => {
                console.log(error)
            })
            
        } else if(type == "lifx") {
            if(lightsData[lightID]['object'] != null) {
                // Or iterate through all of the lights
                getLifxInfo(lightsData[lightID]['object'], lightID).then((data) => {
                    var retData = {
                        'hue': data['hue'],
                        'saturation': data['saturation'],
                        'brightness': data['brightness'],
                        'color_temp': data['color_temp'],
                        'responding': lightResponding
                    }

                    ret(retData)
                }).catch((error) => {
                    if(error.message == 'No LIFX response in time') {
                        // console.log('LIFX Bulb not responding')
                    } else {
                        console.log(error)
                    }
                })
            } else { // LIFX object is null for this light
            }

        } else { // Unknown light type
        }

        // Timeout the function if the light isn't currently responding
        /*setTimeout(function() {
            // If lightResponding hasn't been set to true at this point, 
            // then it means the smart-bulb's info() callback hasn't triggered yet
            if(!lightResponding) {
                if(_lightWasResponding) {
                    //console.log('Light stopped responding!')
                }
                
                lightsData[lightID]['responding'] = false
                _lightWasResponding = false

                var retData = {
                    "brightness": lightsData[lightID]['brightness'],
                    "color_temp": lightsData[lightID]['color_temp'],
                    "responding": false
                }
                
                ret(retData)
            }
        }, 200) // Typical light delay on a TP-LINK LB120 was average ~20ms, while 99%th percentile were 90-150ms
        */
    })

    socket.on('set_light_brightness', function(data) {
        //console.log('Setting brightness to ' + data)

        var now = (new Date()).getTime()

        var bulbID = data["id"]
        
        // Get the type of the bulb
        var type = ""
        if(type == "tp-link") {
            bulb.power(lightData['power'], transition, {brightness: data}).then(status => {
                //console.log(status)
    
                var delay = (new Date()).getTime() - now
    
                //console.log('Brightness delay: ' + delay)
            })
        } else if(type == "lifx") {

        }
    })

    socket.on('set_light_color', function(data) {
        //console.log('Setting color to ' + data + 'k')
        var lightID = data["id"]
        var color = data["color"]

        // Get the type of the bulb
        var type = ""

        bulb.power(lightData['power'], transition, {color_temp: color}).then(status => {
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


// Returns a promise for retrieving the light data
function getLifxInfo(lightObject, lightID) {
    return new Promise((resolve, reject) => {
        // Error checking
        if(lightObject == null) {
            reject(Error("lightObject is null"))
            return
        }

        if(lightID == null) {
            reject(Error("lightID is null"))
            return
        }

        lightObject.getState(function(err, data) {
            if(err) { 
                // console.log(err) // This error should be handled elsewhere
                reject(err)
                return
            }

            
            var colorData = data['color']
            
            lightsData[lightID]['hue'] = colorData['hue']
            lightsData[lightID]['saturation'] = colorData['saturation']
            lightsData[lightID]['brightness'] = colorData['brightness']
            lightsData[lightID]['color_temp'] = colorData['kelvin']
    
            // Set if the light is on or not
            lightsData[lightID]["power"] = (data["power"] == 1)
    
            resolve(lightsData[lightID])
        })
    })
}

// Handle flux changes to update the lightbulb
router.post('/flux', (req, res) => {
    /*
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
    
    // Iterate through all of the bulbs and update them + their respective data

    // Create the bulb object
    bulb = new TPLSmartDevice(bip);

    lightData['color_temp'] = ctmp

    // Transition period of 500ms
    bulb.power(lightData['power'], 500, { color_temp: ctmp })
        .then(status => {
            //console.log(status)
        })
        .catch(err => console.error(err))
    */

    // Send the response back to f.lux? Not sure if this is necessary
    res.end(JSON.stringify(req.query));
})

module.exports.socketHandler = socketHandler
module.exports.router = router;