'use strict'

const { ipcRenderer } = window.require('electron')
const fs = window.require('fs-extra')
const path = window.require('path')

//const { app, dialog } = window.require('electron').remote

////////////////////////////////////////////////////////////////

class App {
  constructor() {
    this.hoge = 'hoge'
  }

  rebuildMenu(data) {
    ipcRenderer.send('rebuild-menu', JSON.stringify(data))
  }
  
  runMain(message, data) {
    ipcRenderer.send(message, data)
  }
}

const app = new App()

export { app }




