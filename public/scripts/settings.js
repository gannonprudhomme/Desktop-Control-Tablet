var settings = {}

var currentTab = '#volume-mixer'

var socket = io()
var defaultTabs = ['#general', '#modules']

var moduleSettings;
var settings;

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

        $(currentTab).show()

        var moduleSettings = {}
        
        $('#modules').append(createHTML('modules', settings['modules']))
        $('#modules').append(createHTML('currentModules', settings['currentModules']))

        //createModuleElements('general', settings)
    })

    socket.emit('module_settings', '', function(data) {
        //console.log(data)

        var currentModules = settings['currentModules']
        for(var mod in currentModules) {
            var id = currentModules[mod].id

            createModuleElements(id, data[id])
        }
    })

    // Iterate over all of the tabs, and hide all that aren't the currently viewed tab
})

// If a user clicks on a link that is 'hidden'
$('a').click(function() {
    // The href, or ID of the div to be selected. Maintain the # at the
    // front of the href, as we'll just have to concatenate it later
    var href = $(this).attr('href') 
    
    //console.log('Previous tab' + currentTab)
    if(currentTab != href) {
        $(currentTab).hide()
    }
    
    //console.log(href)
    $(href).show()

    currentTab = href
})

// Send the updated settings back to the desktop server
function updateSettings() {
    socket.emit(set_settings, settings)
}

function createModuleElements(id, moduleSettings) {
    //console.log("module settings: ")

    for(var key in moduleSettings) {
        var data = moduleSettings[key]

        $('#' + id).append(createHTML(key, data))
        //console.log(key + ': ' + createHTML(data).innerHTML)
    }
}

// Returns and HTML object, recursive
function createHTML(id, settingData) {
    var type = typeof(settingData)

    if(Array.isArray(settingData)) {
        var $parentDiv = $('<div>', {class: 'array'}).append(id)
        
        for(var i in settingData) {
            $parentDiv.append(createHTML(i, settingData[i]))
        }

        return $parentDiv;

    } else {
        var $div = $('<div>')

        switch(type) {
            case "string":
                $div.attr('class', 'element')

                var $input = $('<input>', {type: 'text', class: 'settingData'}).val(settingData)

                $div.append($('<label>', {text: id}))
                $div.append($input)

                return $div

            case "boolean":
                $div.attr('class', 'element')

                var $label = $('<label>', {class: 'switch'})
                $label.append($('<input>', {type: 'checkbox'}))
                $label.append($('<span>', {class: 'slider'}))

                $div.append($('<label>', {text: id}))
                $div.append($label)

                return $div

            case "number":
                $div.attr('class', 'element')

                var $input = $('<input>', {type: 'text'})

                $div.append($('<label>', {text: id}))
                $div.append(input)

                return $div

            case "object":
                $div.attr('class', 'object')
                var $form = $('<form>', {action: ""})

                for(var data in settingData) {
                    // Generate the html for the content of this object
                    $div.append(createHTML(data, settingData[data]))
                }
    
                return $div
                
            default:
                console.log("Unknown type " + type)
        }
    }
}

function createDropdown(key) {

}

function createTextbox() {

}