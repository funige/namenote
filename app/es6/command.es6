'use strict'

import { namenote } from './namenote.es6'

import { divider } from './divider.es6'
import { toolButton } from './tool-button.es6'
import { sideBarTab } from './side-bar-tab.es6'
import { projectManager } from './project-manager.es6'
import { flash } from './flash.es6'

import { dialog } from './dialog.es6'
import { aboutDialog } from './about-dialog.es6'
import { messageBox } from './message-box.es6'
import { openNewDialog } from './open-new-dialog.es6'
import { tabletSettingsDialog } from './tablet-settings-dialog.es6'

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

  auth(options) {
    dialog.open(messageBox, {
      title: 'Authenticate',
      message: 'Namenote would like access to the files in your Dropbox.',
      ok: 'Connect to Dropbox',
      cancel: 'Cancel',

    }).then((responce) => {
      dialog.current.showProgress(T('Connecting ...'))
      var Dropbox = require('dropbox').Dropbox;
      var dbx = new Dropbox({ clientId: 'cex5vkoxd9nwj48'})
      var authUrl = dbx.getAuthenticationUrl('http://localhost:8080/namenote/auth');

      flash.save(options)
      location.href = authUrl

    }).catch((error) => {
      if (error) dialog.open(messageBox, { type: 'error', message: error })
    })
  }
  
  about() {
    dialog.open(aboutDialog).then(() => {
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
    dialog.open(openNewDialog).then(() => {
      dialog.close()

    }).catch((error) => {
      if (error) {
        dialog.open(messageBox, { type: 'error', message: error }).then(() => {
          dialog.close()
        })
      }
    })
  }
  
  openDialog() {
    if (namenote.app) {
      namenote.app.openDialog().then((url) => {
        WARN(`openDialog '${url}'...`)
        projectManager.open(url)

      }).then((project) => {
        WARN('[project]', project)
        
      }).catch((error) => {
        if (error) dialog.open(messageBox, { type: 'error', message: error })
      })

    } else {
      const accessToken = localStorage.getItem('namenote/raw_token')

      if (accessToken) {
        var fetch = require('isomorphic-fetch'); // or another library of choice.
        var Dropbox = require('dropbox').Dropbox;
        var dbx = new Dropbox({
          fetch: fetch,
          accessToken: accessToken
        })

        dbx.filesListFolder({path: ''}).then((response) => {
          console.log(response);
        }).catch((error) => {
          console.log(error);
        });
        return
        ///////////////////////////////////////////////////////////////

      } else {
        return this.auth(['openDialog'])
      }
    }
  }

  open(url) {
    if (namenote.app) {
      WARN(`open '${url}'...`)
      projectManager.open(url).then((project) => {
        WARN('[project]', project)
        
      }).catch((error) => {
        if (error) dialog.open(messageBox, { type: 'error', message: error })
      })
      
    } else {
      return this.auth(['open', url])
    }
  }

  close() {
    projectManager.close()
  }

  zoom() {
    LOG('zoom')
  }

  unzoom() {
    LOG('unzoom')
  }

  dockLeft() {
    divider.setPosition('left')
  }

  dockRight() {
    divider.setPosition('right')
  }
  
  toggleEditMode() {}

  tabletSettings() {
    dialog.open(tabletSettingsDialog).then(() => {
      dialog.close()

    }).catch(() => {
      dialog.close()
    })
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
