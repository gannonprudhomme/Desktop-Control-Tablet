var express = require('express')
var router = express.Router()
var {exec} = require('child_process')
var child_process = require('child_process')
var psList = require('ps-list')

// Map of all of the tasks
// Doesn't really need to be a mapped key-value pair, just need the
// keys to be hashed for O(1) insertion and searching
// Currently the value is the number of tasks with that name
var taskMap = new Map()

// Update the currently running tasks every second
setInterval(loadTaskList, 1000)

// Returns a Promise with a Map of the current tasks in (taskName : instanceCount) pairs
function loadTaskList() {
    return new Promise((resolve, reject) => {
        psList().then(tasks => {
            // Clear the previous tasks
            taskMap.clear()
    
            // Iterate over all of the tasks
            for(var i in tasks) {
                var task = tasks[i]
                var name = task['name']
    
                // If the map already has this key
                if(taskMap.has(name)) {
                    // Increment how many tasks of that name are running
                    taskMap.set(name, taskMap.get(name) + 1)
                } else {
                    // Otherwise, insert the task with an instance count of 1
                    taskMap.set(name, 1)
                }
            }
    
            // Send the task map back
            resolve(taskMap)
        }).catch(error => {
            // If there was an error in retrieving the task list, reject the promise
            // console.log(error)
    
            reject(error)
        })
    })
}

// Returns a Promise, waiting for the command to output
function getCommandOutput(commandName, options) {
    return new Promise((resolve, reject) => {
        var spawn = child_process.spawn
        var command = spawn(command, options)

        command.stdout.on('data', function(data) {
            resolve(data)
            console.log('Command: ' + command + ' returned ' + data)
        })

        command.on('close', function(code) {
            console.log('child process exited with code ' + code)
        })
    })

    return command
}

function getTaskMap() {
    return taskMap
}

module.exports.loadTaskList = loadTaskList
// module.exports.getTaskList = getTaskList
module.exports.getTaskMap = getTaskMap