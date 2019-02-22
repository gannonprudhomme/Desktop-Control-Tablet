const {app, BrowserWindow} = require('electron')

const server = require('./app.js') // initialize the server

let mainWindow


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
        server.kill() // Kill the node server
    })
    
    mainWindow.maximize()
    
    console.log('Created window')
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
        server.kill() // Kill the node server
    }
})

app.on('activate', function() {
    if(mainWindow == null) {
        createWindow()
        
        mainWindow.loadURL('http://localhost:3000/tablet')
    }
})

// Disable Electron warnings
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';