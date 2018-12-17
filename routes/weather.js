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
            if(error) console.log(error)
            var data = d[0]

            var retData = {}
            retData['currentTemp'] = data['current']['temperature']
            retData['currentWeather'] = data['current']['skytext']
            retData['futureForecasts'] = data['forecast'] // Forecasts for the today + next 3 days
            result(retData)
        })
    })
}

module.exports.socketHandler = socketHandler