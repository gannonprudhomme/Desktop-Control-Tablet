$("#pause").click(function() {
  sendPlayback('pause', '')
})

$('#play').click(function() {
  sendPlayback('play', '')
})

function sendPlayback(type, option) {
  console.log('attempted to send playback')

  var instance;
  if(type === 'pause') {

    instance = axios.create({
      baseURL: 'http://192.168.1.78:3000/spotify-api/pause',
      timeout: 3000,
      headers: {'X-Custom-Header': 'foobar'}
    })
  } else if(type === 'play') {
    var instance = axios.create({
      baseURL: 'http://192.168.1.78:3000/spotify-api/play',
      timeout: 3000,
      headers: {'X-Custom-Header': 'foobar'}
    })
  }

  instance.put('', {}).then(function(response) {
    console.log(response.data);
  }).catch(function(error) {
    console.log(error);
  })
}
