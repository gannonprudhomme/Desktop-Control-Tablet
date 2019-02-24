const weather = require('weather-js')
const fs = require('fs')
const Route = require('./route.js')

class Weather extends Route {
  constructor() {
    super()

    this.weatherSettings = JSON.parse(fs.readFileSync('./public/views/modules/weather.json'))
  }

  socketHandler(socket) {
    socket.on('get_forecast', (data, ret) => {
      this.getForecast().then((data) => {
        ret(data)
      }).catch((error) => {
        console.log(error)
      })
    })
  }

  // Retrieve the current forecast and return it as a dictionary
  getForecast() {
    return new Promise((result, reject) => {
      weather.find({search: this.weatherSettings['zipcode'], degreeType: 'F'}, function(error, d) {
        if(error) { // If there was an error
          console.log(error)
          reject(error)
        }

        const retData = {}

        // If the data was loaded
        if(d) {
          const data = d[0]

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
}


module.exports = Weather
