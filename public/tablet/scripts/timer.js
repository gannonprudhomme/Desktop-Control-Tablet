var countdown = 20
$('#countdown-number').text(countdown)

setInterval(function() {
  countdown = --countdown <= 0 ? 20 : countdown;

  $('#countdown-number').text(countdown)
}, 1000)
