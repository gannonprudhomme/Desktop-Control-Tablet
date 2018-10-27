$(document).ready(function() {
  var socket = io()
  socket.emit('chat message', 'hello!')
})
