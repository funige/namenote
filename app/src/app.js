import { config } from './config.js'

const { ipcRenderer } = window.require('electron')
const fs = window.require('fs-extra')
const path = window.require('path')

const { dialog } = window.require('electron').remote

/*const openParams = {
  defaultPath: null,
  properties: ['openDirectory', 'openFile'],
  filters: [
    { name: 'Namenote', extensions: ['namenote'] }
  ],
}*/

////////////////////////////////////////////////////////////////

class App {
  constructor() {
    this.initPath()
  }

  updateDefaultPath(url) {
    config.data.defaultPath = path.dirname(url) //.replace(/\/[^/]+?$/, '')
    config.save()
  }
  
  showMessageForm(options) {
    return new Promise((resolve, reject) => {
      dialog.showMessageForm(options, (response) => {
        resolve(response)
      })
    })
  }
  
  rebuildMenu(data) {
    ipcRenderer.send('rebuild-menu', JSON.stringify(data))
  }

  setTitle(title) {
    ipcRenderer.send('set-title', title)
  }

  runMain(message, data) {
    ipcRenderer.send(message, data)
  }

  initPath() {
    ipcRenderer.send('init-path')
  }
}

const app = new App()

export { app }
