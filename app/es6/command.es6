'use strict'

import { namenote } from './namenote.es6'

import { divider } from './divider.es6'
import { toolButton } from './tool-button.es6'
import { sideBarTab } from './side-bar-tab.es6'
import { projectManager } from './project-manager.es6'
import { flash } from './flash.es6'
import { file } from './file.es6'

import { dialog } from './dialog.es6'
import { AboutDialog } from './about-dialog.es6'
import { TabletSettingsDialog } from './tablet-settings-dialog.es6'
import { OpenDialog } from './open-dialog.es6'

//import { openNewDialog } from './open-new-dialog.es6'

const _runMain = (message, data) => {
  if (namenote.app) {
    LOG('runMain', message, data)
    namenote.app.runMain(message, data)

  } else {
    LOG(`${message}: can\`t execute this command on browser.`)
  }
}

////////////////////////////////////////////////////////////////

class Command {
  constructor() {
  }

  undo() {
    LOG('undo')
  }

  redo() {
    LOG('redo')
  }

  about() {
    dialog.open(new AboutDialog()).then(() => {
      dialog.close()
    })
  }

  pen(e) {
    LOG('pen')
    toolButton.select('pen')
  }

  eraser(e) {
    LOG('eraser')
    toolButton.select('eraser')
  }

  text(e) {
    LOG('text')
    toolButton.select('text')
  }

  sideBar() {
    LOG('sideBar')
    divider.toggle()
  }

  showPageView() {
    $(namenote.pageView.element).show()
    $(namenote.textView.element).hide()
    sideBarTab.select('page')
  }

  showTextView() {
    $(namenote.pageView.element).hide()
    $(namenote.textView.element).show()
    sideBarTab.select('text')
  }
  
  openNewDialog() {
    file.openNewDialog().catch((error) => {
      dialog.alert(error)
    })
  }

  openDialog() {
    file.openDialog().catch((error) => {
      dialog.alert(error)
    })
  }

  open(url) {
    file.open(url).catch((error) => {
      dialog.alert(error)
    })
  }

  exportCSNF() {
    file.exportCSNFDialog().catch((error) => {
      dialog.alert(error)
    })
  }

  exportPDF() {
    file.exportPDFDialog().catch((error) => {
      dialog.alert(error)
    })
  }
  
  savePageImage() {
    file.savePageImageDialog().catch((error) => {
      dialog.alert(error)
    })
  }
  
  /*close() {
    projectManager.close()
  }*/

  zoom() {
    namenote.mainView.zoom()
  }

  unzoom() {
    namenote.mainView.unzoom()
  }

  dockLeft() {
    divider.setPosition('left')
  }

  dockRight() {
    divider.setPosition('right')
  }
  
  toggleEditMode() {}

  tabletSettings() {
    dialog.open(new TabletSettingsDialog()).then(() => {
      dialog.close()
    }).catch((error) => { dialog.alert(error) })
  }

  logout(scheme) {
    file.logout(scheme)
  }

  hoge() {
    LOG('hoge.')
  }
  
  //////////////////
  
  do(item, data) {
    if (item && this[item]) {
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
