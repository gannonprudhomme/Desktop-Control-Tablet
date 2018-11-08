var tabs = ['#general', '#modules', '#volume-sliders', '#pc-stats']
var currentTab = '#general'

$(document).ready(function() {
    // Iterate over all of the tabs, and hide all that aren't the currently viewed tab
    for(var index in tabs) {
        var tab = tabs[index]
        if(tab != currentTab) {
            console.log('tab ' + tab + ' current ' + currentTab)
            $(tab).hide() 
        }
    }
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
    
    $(href).show()

    currentTab = href
})
