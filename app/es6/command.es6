'use strict'

import { namenote } from './namenote.es6'
import { dialog } from './dialog.es6'
import { aboutDialog } from './about-dialog.es6'
import { sideBar } from './side-bar.es6'
import { toolButton } from './tool-button.es6'

const _runMain = (message, data) => {
  if (namenote.app) {
    log('runMain', message, data)
    namenote.app.runMain(message, data)

  } else {
    log(`${message}: can\`t execute this command on browser.`)
  }
}

////////////////////////////////////////////////////////////////

class Command {
  constructor() {
  }

  undo() {
    log('undo')
  }

  redo() {
    log('redo')
  }

  about() {
    dialog.open(aboutDialog)
  }

  pen(e) {
    log('pen')
    toolButton.select('pen')
  }

  eraser(e) {
    log('eraser')
    toolButton.select('eraser')
  }

  text(e) {
    log('text')
    toolButton.select('text')
  }

  sideBar() {
    log('sideBar')
    sideBar.toggle()
  }

  toggleEditMode() {}
  
  //////////////////
  
  do(item, data) {
    if (this[item]) {
      this[item](data)
    }
  }
  
  //////////////////

  developerTools() {
    _runMain('developerTools')
  }
  
  fullScreen() {
    if (namenote.app) {
      _runMain('fullScreen')
    } else {
      document.documentElement.requestFullscreen()
    }
  }
  
  quit() {
    _runMain('quit')
  }
}

const command = new Command()

export { command }
