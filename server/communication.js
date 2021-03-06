const fs = require('fs')
const path = require('path');
const socketIO = require('socket.io-client')
const Route = require('./routes/route.js')

class Communication extends Route {
  constructor(settings, desktop) {
    super()

    // The settings for the remote servers
    this.remoteSettings = settings['remotes']
    this.desktop = desktop

    // Whether we're connected to the desktop server or not
    this.connected = false

    // TODO: Make the port configurable
    this.client = socketIO('http://' + this.remoteSettings[0]['ip'] + ':3001')

    const that = this;
    this.client.on('connect', () => {
      that.connected = true
    });

    this.client.on('disconnect', () => {
      that.connected = false;
    })
  }

  socketHandler(socket) {
    socket.on('connectedToServer', (data, ret) => {
      ret(this.connected)
    })

    socket.on('active_programs', (data, ret) => {
      this.emitToServer('active_programs', '').then((data) => {
        ret(data)
      }).catch((error) => {
      })
    })

    socket.on('audio_device', (data) => {
      this.client.emit('audio_device', data)

      // Set the currentAudioDevice property in desktop.js to be used for various volume stuff
      this.desktop.setCurrentAudioDevice(data)
    })

    socket.on('screenshot', (data) => {
      this.client.emit('screenshot', '')
    })

    socket.on('pc_stats', (data, ret) => {
      // First need to check if the client(windows 10 server) is connected or not
      this.client.emit('pc_stats', '', function(retData) {
        ret(retData)
      })
    })

    socket.on('set_volume', (data) => {
      this.client.emit('set_volume', data)

      // Set the volume in the volumes array in desktop.js and save it to the file system
      this.desktop.setVolume(data.program, data.volume)
    })

    socket.on('set_volume_proc', (data) => {
      this.client.emit('set_volume_proc', data);
    });

    socket.on('get_volume_processes', (_, ret) => {
      this.client.emit('get_volumes', '', (data) => {
        ret(data);

        data.forEach((volumeProc) => {
          const { name } = volumeProc;

          this.client.emit('get_volume_icon', name, (retData) => {
            // Save it to a file
            const p = path.join(__dirname, `./icons/${name}.png`);

            const file = fs.writeFile(p, retData, { flag: 'w', }, (err) => {
              if (err) {
                console.log(err);
              }
            });
          });
        });
      });
    });
  }

  // Send a string of key-presses to the client(windows 10 server)
  sendKeypress(keys) {
    this.client.emit('shortcut', keys)
  }

  emitToServer(route, data) {
    return new Promise((resolve, reject) => {
      let responded = false

      this.client.emit(route, data, (retData) => {
        resolve(retData)

        responded = true
      })

      let tries = 5 // Check if we're connected 5 times
      const delay = 500 // Check every 1/2 second
      const timer = setInterval(() => {
        if(!responded && tries <= 0) {
          // If we were previously connected to the server
          if(this.connected) {
            console.log('Disconnected from the server') // Notify that we disconnected from the server
          }
          this.connected = false
          reject(Error('server-timeout'))
          clearInterval(timer)
        } else if(responded) {
          // If we were previously disconnected
          if(!this.connected) {
            console.log('Reconnected to the server!') // Notify that we reconnected from the server
          }

          this.connected = true
          clearInterval(timer)
        } else {
          tries--
          // console.log('Tries: ' + tries)
        }
      }, delay)
    })
  }
}

module.exports = Communication
