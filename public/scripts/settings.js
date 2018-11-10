var settings = {}

var currentTab = '#general'

var socket = io()
var defaultTabs = ['#general', '#modules']

var moduleSettings;

$(document).ready(function() {
    socket.emit('settings', '', function(data) {
        settings = data

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

    // socket.emit('module_settings', '', function(data) {
    //     module_settings = data

    //     console.log(data)
    // })
    
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

function createModuleElements(modules) {
    for(var mod in modules) {

    }
}
