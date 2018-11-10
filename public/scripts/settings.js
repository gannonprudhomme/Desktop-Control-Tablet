var settings = {}

var currentTab = '#general'

var socket = io()
var defaultTabs = ['#general', '#modules']

var moduleSettings;
var settings;

$(document).ready(function() {
    socket.emit('settings', '', function(data) {
        settings = data

        //console.log(settings)

        // Hide the body content of the default tabs
        for(var i in defaultTabs) {
            var name = defaultTabs[i]
            
            if(name != currentTab) {
                $(name).hide() 
            }
        }

        // hide the body content of the module settings tabs
        var currentModules = settings['currentModules']
        for(var i in currentModules) {
            var name = "#" + currentModules[i].id
            
            if(name != currentTab) {
                $(name).hide() 
            }
        }
    })

    socket.emit('module_settings', '', function(data) {
        console.log(data)

        var currentModules = settings['currentModules']
        for(var mod in currentModules) {
            var id = currentModules[mod].id

            console.log('Creating module elements for ' + id)

            createModuleElements(data[id])
        }
    })

    // Iterate over all of the tabs, and hide all that aren't the currently viewed tab
    
})

// If a user clicks on a link that is 'hidden'
$('a').click(function() {
    // The href, or ID of the div to be selected. Maintain the # at the
    // front of the href, as we'll just have to concatenate it later
    var href = $(this).attr('href') 
    
    console.log('Previous tab' + currentTab)
    if(currentTab != href) {
        $(currentTab).hide()
    }
    
    console.log(href)
    $(href).show()

    currentTab = href
})

// Send the updated settings back to the desktop server
function updateSettings() {
    socket.emit(set_settings, settings)
}

function createModuleElements(id, moduleSettings) {
    // console.log("module settings: ")
    // console.log(moduleSettings)

    var div = $('#' + id)

    for(var key in moduleSettings) {
        var data = moduleSettings[key]

        console.log(key + ': ' + createHTML(data))
    }
}

// Returns and HTML object, recursive
function createHTML(settingData) {
    var type = typeof(settingData)

    //console.log('Setting Data: ' + settingData)

    /*if(Array.isArray(settingData)) {
        console.log("ARRAY" + settingData)
    } */

    if(Array.isArray(settingData)) {
        var ret = type + ": [";
        
        for(var i in settingData) {
            ret += createHTML(settingData[i]) + ", "
        }

        ret += "]"

        return ret;

    } else {
        switch(type) {
            case "string":
                break
            case "boolean":
                break
            case "number":
                break
    
            case "object":
                var ret = type + ": [";
    
                for(var data in settingData) {
                    // Generate the html for the content of this object
                    ret += createHTML(data) + ", "
                }
    
                ret += "]"

                return ret
    
                break 
            default:
                console.log("Unknown type " + type)
        }
    }

    return type + " "
}

function createDropdown(key) {

}

function createTextbox() {

}