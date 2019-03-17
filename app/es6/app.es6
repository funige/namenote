'use strict'

import { config } from './config.es6'

const { ipcRenderer } = window.require('electron')
const fs = window.require('fs-extra')
const path = window.require('path')

const { dialog } = window.require('electron').remote

const openParams = {
  defaultPath: null,
  properties: ['openDirectory', 'openFile'],
  filters: [
    { name: 'Namenote', extensions: ['namenote'] }
  ],
}

////////////////////////////////////////////////////////////////

class App {
  constructor() {
  }

  openDialog(defaultPath) {
    defaultPath = defaultPath || config.data.defaultPath
    if (!fs.existsSync(defaultPath)) {
      defaultPath = null
    }
    
    return new Promise((resolve, reject) => {
      const params = {
        defaultPath: defaultPath,
        properties: ['openDirectory', 'openFile'],
        filters: [
          { name: 'Namenote', extensions: ['namenote'] }
        ]
      }
      dialog.showOpenDialog(params, (filenames) => {
        if (filenames) {
          //const filename = this.getFilename(filenames[0])
          namenote.fileSystem.completePath(filenames[0]).then((url) => {
            WARN('-...', url)
            const baseURL = path.dirname(url)
            this.updateDefaultPath(baseURL)
            resolve(url)
          })
        }
      }) 
    })
  }

/*  getFilename(filename) {
    if (filename.match(/\.namenote$/i)) {
      return filename
    }
    // get any *.namenote file under the folder
    if (fs.statSync(filename).isDirectory()) {
      for (const item of fs.readdirSync(filename)) {
        if (item.match(/\.namenote$/i)) {
          return path.resolve(filename, item)
        }
      }
    }
    return null
  }*/
  
  updateDefaultPath(url) {
    config.data.defaultPath = path.dirname(url) //.replace(/\/[^/]+?$/, '')
    config.save()
  }
  
  showMessageBox(options) {
    return new Promise((resolve, reject) => {
      dialog.showMessageBox(options, (response) => {
        resolve(response)
      })
    })
  }

  /*////////////////

  stat(path, callback) {
    fs.stat(path, callback)
  }

  readdir(path, callback) {
    fs.readdir(path, callback)
  }
  
  ////////////////
  */
  
  rebuildMenu(data) {
    ipcRenderer.send('rebuild-menu', JSON.stringify(data))
  }

  setTitle(title) {
    ipcRenderer.send('set-title', title)
  }

  runMain(message, data) {
    ipcRenderer.send(message, data)
  }
}

const app = new App()

export { app }




