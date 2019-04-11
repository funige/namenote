'use strict'

import { namenote } from './namenote.es6'

import { divider } from './divider.es6'
import { toolButton } from './tool-button.es6'
import { sideBarTab } from './side-bar-tab.es6'
import { projectManager } from './project-manager.es6'
import { flash } from './flash.es6'

import { dialog } from './dialog.es6'

import { AboutDialog } from './about-dialog.es6'
import { TabletSettingsDialog } from './tablet-settings-dialog.es6'

//import { openNewDialog } from './open-new-dialog.es6'
//import { OpenDialog } from './open-dialog.es6'

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
    $('.page-view').show()
    $('.text-view').hide()
    sideBarTab.select('page')
  }

  showTextView() {
    $('.page-view').hide()
    $('.text-view').show()
    sideBarTab.select('text')
  }
  
  openNewDialog() {
    LOG('open new dialog')
  }

  openDialog() {
    namenote.fileSystem.openDialog()
  }

  open(url) {
    namenote.fileSystem.open(url)
  }

  close() {
    projectManager.close()
  }

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

  logout() {
    namenote.fileSystem.logout()
  }

  /*async sleep(delay, result) {
    return new Promise(resolve => {
      setTimeout(() => resolve(result), delay)
    })
  }
  
  async hoge() {
    await this.sleep(1000)
    console.log(1)

    let result = await this.sleep(2000, 42)
    console.log(result)
  }

  __hoge() {
    const project = namenote.projectManager.current
    const page = project.pages[1]
    const canvas = page.canvas

    const thumbnail = document.createElement('canvas')
    thumbnail.width = canvas.width
    thumbnail.height = canvas.height

    const ctx2 = thumbnail.getContext('2d')
    ctx2.filter = 'blur(4px)'
    ctx2.drawImage(canvas, 0, 0)

    const ctx = canvas.getContext('2d')
    ctx.drawImage(thumbnail,
                  0, 0, canvas.width, canvas.height,
                  0, 0, canvas.width / 8, canvas.height / 8)
    ctx.drawImage(canvas,
                  0, 0, canvas.width, canvas.height,
                  canvas.width / 8 + 10, 0, canvas.width / 8, canvas.height / 8)

    LOG('blur test..', canvas.width, canvas.height)
  }*/
  
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
