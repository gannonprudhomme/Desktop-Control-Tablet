const {app, BrowserWindow} = require('electron')
const setupPug = require('electron-pug')

var path = require('path')
var fs = require('fs')
var os = require('os')
var queryString = require('querystring')
var server = require('./app.js')

var desktop = require('./routes/desktop.js')
var spotify = require('./routes/spotify.js')

let mainWindow

var spotifyAuthenticated = false

// Create the window
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })
    
    mainWindow.on('closed', function() {
        mainWindow = null
    })
    
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
        async() => {
            var json = JSON.parse(fs.readFileSync(path.join(__dirname + '/view-settings.json'), 'utf8'))
            var options = {
                show_current_time: json['show-current-time'], 
                quickIcons: json['quickIcons'],
                modules: json['modules'],
                currentModules: json['currentModules'],
                volumeMixers: json['volume-mixers']
            }
            
            // Load in all of the settings data for all of our current modules
            var modSettings = desktop.getModuleSettings(json['currentModules'])
            
            // Add the module settings to the above option settings, to be sent to Pug to be used in our page
            options = {...options, ...modSettings}
            
            console.log(options)

            try {
                let pug = await setupPug({pretty: true}, options)
                pug.on('error', err => console.error('electron-pug error', err))
                console.log('setup pug')
            } catch(err) {
                console.err()
            }
            
            // Render the webpage
            //res.render('index', options)
            
            // Create window
            createWindow()
            
            console.log('loading url')

            mainWindow.loadURL('file::/${__dirname}/public/views/index.pug')
        }
    
    }
})