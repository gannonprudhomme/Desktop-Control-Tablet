var weather = require('weather-js')
var fs = require('fs')
var weatherSettings = JSON.parse(fs.readFileSync('./public/views/modules/weather.json'))

var socketHandler = function(socket) {
    socket.on('get_forecast', function(data, ret) {
        getForecast().then((data) => {
            ret(data)
        }).catch((error) => {
            console.log(error)
        })
    })
}

function getForecast() {
    return new Promise((result, reject) => {
        weather.find({search: weatherSettings['zipcode'], degreeType: 'F'}, function(error, d) {
            if(error) { // If there was an error
                console.log(error)
                reject(error)
            }
            
            var retData = {}

            // If the data was loaded
            if(d) {
                var data = d[0]

                retData['currentTemp'] = data['current']['temperature']
                retData['currentWeather'] = data['current']['skytext']
                retData['futureForecasts'] = data['forecast'] // Forecasts for the today + next 3 days
                result(retData)

            } else { // Couldn't load the data, return invalid data
                console.log('Weather data couldnt be loaded!')
                retData['currentTemp'] = -99
                retData['currentWeather'] = 'N/A'
                retData['futureForecasts'] = [] // Forecasts for the today + next 3 days
                result(retData)

            }
        })
    })
}

module.exports.socketHandler = socketHandler