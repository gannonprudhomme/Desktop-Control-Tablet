function updateWidget() {
  console.log('Updating weather widget')
  socket.emit('get_forecast', '', function(data) {
    console.log(data)
    const weather = data['currentWeather']
    const temperature = data['currentTemp']

    $('#forecast').text(weather)
    $('#temperature').text(temperature + '°F')
  })
}

updateWidget()
setInterval(updateWidget, 10 * 60 * 1000 )