'use strict'

import { namenote } from './namenote.es6'
import { dialog } from './dialog.es6'
import { aboutDialog } from './about-dialog.es6'
import { divider } from './divider.es6'
import { toolButton } from './tool-button.es6'
import { sideBarTab } from './side-bar-tab.es6'
import { projectManager } from './project-manager.es6'

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
    divider.toggle()
  }

  showPageView() {
    $('.page-view').show()
    $('.text-view').hide()
    sideBarTab.select('page')
  }

  showTextView() {
    $('.page-view').hide()
    $('.text-view').show()
    sideBarTab.select('text')
  }
  
  openDialog() {
    if (namenote.app) {
      namenote.app.openDialog().then((url) => {
        warn(`openDialog '${url}'...`)
        projectManager.open(url)

      }).then((project) => {
        //warn('project=', project)
        
      }).catch((error) => {
        if (error) {
          namenote.app.showMessageBox({
            type: 'error',
            message: error
          })
        }
      })
    }
  }

  open(url) {
    log('open...')
    projectManager.open(url)
  }

  openNewDialog() {
    warn('open new dialog..')
  }
  
  close() {
    projectManager.close()
  }

  zoom() {
    log('zoom')
  }

  unzoom() {
    log('unzoom')
  }

  dockLeft() {
    divider.setPosition('left')
  }

  dockRight() {
    divider.setPosition('right')
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

  reload() {
    location.reload()
  }
}

const command = new Command()

export { command }
