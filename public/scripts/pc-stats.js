var socket = require('socket.io-client')('http://localhost:3000')
// var usage_stats = {} // PC Performance usage stats

var minAngle = 45
var maxAngle = 315

var quarterColor = '#ffe601' // 0% - 25%
var halfColor = '#ffa101' // 25% - 50%
var threeQuarterColor = '#ff5501' // 50% - 75%
var fullColor = '#ff0101' // 75% - 100%

var i = 0
$(document).ready(function() {
  $('.dial-arm').css('transform', 'rotate(' + minAngle + 'deg)')
})

// Retrive the performance info every second
window.setInterval(function() {
  getPerformanceInfo()
}, 1000)

function getPerformanceInfo() {
  socket.emit('pc_stats', '', function(data) {
    // usage_stats.cpuUsage = data.cpuUsage
    // usage_stats.cpuFree = data.cpuFree
    // usage_stats.usedMemory = data.usedMemory
    // usage_stats.totalMemory = data.totalMemory

    // Calculate what % of the cpu and ram are being used
    var cpuPercent = Math.floor(data.cpuUsage * 100) + 5
    var memoryPercent = Math.floor((data.usedMemory) / data.totalMemory * 100)

    // Divide the memory by 1000 to convert to gigabytes
    // Then round * 10 and / 10 to round up to the 1st decimal place
    var usedMemoryRounded = Math.round((data.usedMemory / 1000) * 10) / 10;
    var totalMemoryRounded = Math.round((data.totalMemory / 1000))

    // console.log(usedMemoryRounded + '/' + totalMemoryRounded + '.0 GB')
    // console.log(usage_stats.cpuFree + ' ' + usage_stats.cpuUsage)

    // Rotate the dial arms accordingly
    rotateDial('cpu-dial-arm', Math.floor(cpuPercent))
    rotateDial('memory-dial-arm', Math.floor(memoryPercent))

    if(cpuPercent > 100) { cpuPercent = 100 }

    // Set the according text
    $('#cpu-percentage').text(cpuPercent + '%')
    $('#memory-percentage').text(usedMemoryRounded + ' GB')
    // $('#memory-percentage').text(usedMemoryRounded + '/' + totalMemoryRounded + '.0 GB')
    // $('#memory-percentage').text(memoryPercent + '%')
  })
}

function rotateDial(id, percentage) {
  // Convert the percetange
  var angle = (percentage / 100) * (maxAngle - minAngle)
  angle = angle + minAngle

  var c = halfColor
  if(percentage <= 25) {
    c = quarterColor
  } else if(percentage > 25 && percentage <= 50) {
    c = halfColor
  } else if(percentage > 50 && percentage <= 75) {
    c = quarterColor
  } else {
    c = fullColor
  }

  // $('.dial').animate({ borderTopColor: c, borderLeftColor: c, borderRightColor: c, borderBottomColor: c }, 1000);
  $('#' + id).transition({rotate: angle + 'deg'}, 750, 'ease')
}
