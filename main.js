const {app, BrowserWindow} = require('electron')
const url = require('url');
const path = require('path');

const Server = require('./app.js') // initialize the server

let mainWindow
const server = new Server((res) => {
  if (process.env.NODE_ENV !== 'production') {
    mainWindow.loadURL('http://localhost:2003');
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, './dist/index.html'),
        protocol: 'file:',
        slashes: true
      })
    )
  }
});
server.start()

// Create the window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      // This enables us to do CORS requests. Needed for VolmueMixer icon retrieval retrying
      webSecurity: false,
    },
  })

  mainWindow.on('closed', function() {
    mainWindow = null
    server.kill() // Kill the node server
  })

  console.log('Created window')
}

// When electron is ready, load the pug file and its settings and render it
app.on('ready', async () => {
  // Create window
  createWindow()

  mainWindow.loadURL('http://localhost:3000/tablet')
})


app.on('window-all-closed', function() {
  if(process.platfornm !== 'darwin') {
    app.quit()
    server.kill() // Kill the node server
  }
})

app.on('activate', function() {
  if(mainWindow == null) {
    createWindow()
  }
})

// Disable Electron warnings
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
