let screenStatus = {
  brightness: 0,
  power: false,
  minBrightness: 8, // The screen isn't visible anything past 9%
  maxBrightness: 100,
}

function getScreenInfo() {
  socket.emit('rpi_get_info', '', (retData) => {
    screenStatus = retData

    initComponents()
    getGlobalClick()
  })
}

// Only intialize the components(mainly the slider) until
// the screenStatus information is loaded in, should be quick
function initComponents() {
  $('#screen-brightness-slider').slider({
    value: screenStatus['brightness'] / screenStatus['maxBrightness'] * 100,
    min: screenStatus['minBrightness'] / screenStatus['maxBrightness'] * 100, // min isn't always 0
    max: 100,
    animate: 'fast',
    orientation: 'horizontal',

    slide: (e, ui) => {
      $('#screen-brightness-label').text(Math.round(ui.value) + '%')

      setScreenBrightness(Math.round(ui.value / 100 * screenStatus['maxBrightness']))
    },
  })

  $('#screen-brightness-label').text(Math.round(screenStatus['brightness'] / screenStatus['maxBrightness'] * 100) + '%')

  // We'll only really turn the screen off
  $('#screen-power-icon').on('click', (event) => {
    event.stopPropagation()
    event.stopImmediatePropagation()

    // Toggle the screen power
    screenStatus['power'] = false

    // Turn the screen off
    setScreenPower(false)
  })
}

// Register a click action that triggers on any click on the screen
function getGlobalClick() {
  document.addEventListener('click', () => {
    // If the screen is currently asleep, wake it up
    if(screenStatus['power'] == false) {
      setScreenPower(true)
      screenStatus['power'] = true
    }
  })
}

function setScreenBrightness(value) {
  socket.emit('rpi_set_brightness', value)
}

function setScreenPower(value) {
  socket.emit('rpi_set_screen_power', value)
}

// Initialize
getScreenInfo()
