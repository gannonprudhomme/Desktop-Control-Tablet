var socket = io()

$(document).ready(function() {

})

$('#light-brightness-slider').slider({
    value: 0,
    min: 0,
    max: 100,
    animate: "fast",
    orientation: "horizontal",

    slide: function(e, ui) {

    }
})

$('#light-brightness-label').text('00%')

// set the min and max value depending on the f.lux range?
$('#flux-slider').slider({
    value: 0,
    min: 2500,
    max: 6500,
    animate: "fast",
    orientation: "horizontal",

    slide: function(e, ui) {
        $('#flux-label').text('00%')
    }
})

$('#flux-label').text('00%')