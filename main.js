const {app, BrowserWindow} = require('electron')

require('./app.js') // initialize the server

let mainWindow

const maximizeWindow = true

// Create the window
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false, // Disable the title and menu bar
        webPreferences: {
            nodeIntegration: true
        }
    })
    
    mainWindow.on('closed', function() {
        mainWindow = null
    })

    mainWindow.maximize()
    
    console.log('created window')
}

// When electron is ready, load the pug file and its settings and render it
app.on('ready', async() => {
    // Create window
    createWindow()

    mainWindow.loadURL('http://localhost:3000/tablet')
})


app.on('window-all-closed', function() {
    if(process.platfornm !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function() {
    if(mainWindow == null) {
        createWindow()

        mainWindow.loadURL('http://localhost:3000/tablet')
    }
})