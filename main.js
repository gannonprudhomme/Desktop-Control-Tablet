const {app, BrowserWindow} = require('electron')
const setupPug = require('electron-pug')

var express = require('express')
var multer = require('multer') // for parsing multipart/form-data
var bodyParser = require('body-parser') // for parsing basic request data?
var path = require('path')
var fs = require('fs')
var queryString = require('querystring')

var desktop = require('./routes/desktop.js')

let mainWindow

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

app.on('ready', async() => {
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

        mainWindow.loadFile('./public/views/index.pug')
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