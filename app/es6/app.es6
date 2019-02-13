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

  loadJSON(url) {
    return new Promise((resolve, reject) => {
      fs.readFile(url, 'utf8', (err, json) => {
        if (err) {
          return reject(err)
        }
        resolve(JSON.parse(json))
      })
    })
  }

  saveJSON(url, data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(url, JSON.stringify(data), 'utf8', (err) => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  }
  
  openDialog(defaultPath) {
    defaultPath = defaultPath || config.data.defaultPath
    if (!fs.existsSync(config.data.defaultPath)) {
      defaultPath = null
    }
    
    return new Promise((resolve, reject) => {
      const params = JSON.parse(JSON.stringify(openParams))
      params.defaultPath = defaultPath
      
      dialog.showOpenDialog(params, (filenames) => {
        if (filenames) {
          const filename = this.getFilename(filenames[0])
          if (filename) {
            const dirname = path.dirname(filename)
            this.updateDefaultPath(dirname)
            resolve(dirname)

          } else {
            reject(`${T("File open error.")}`)
          }
          return
        }
        reject()
      }) 
    })
  }

  getFilename(filename) {
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
  }
  
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
  
  ////////////////

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




