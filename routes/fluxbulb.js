// Based off of https://github.com/ToXIc-Dev/flux-tplink-smart-bulbs
const express = require('express')
const router = express.Router()

const TPLSmartDevice = require('tplink-lightbulb')

var bip = '192.168.1.81';  // Enter the bulbs IP - You can find this using your router or the scan command on Konsumer's tplink-lightbulb API.

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
    const bulb = new TPLSmartDevice(bip);

    
    bulb.power(true, 500, { color_temp: ctmp })
        .then(status => {
            //console.log(status)
        })
        .catch(err => console.error(err))

    // Send the response back to f.lux? Not sure if this is necessary
    res.end(JSON.stringify(req.query));
})

module.exports = router;