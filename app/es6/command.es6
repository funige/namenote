'use strict'

import { namenote } from './namenote.es6'
import { dialog } from './dialog.es6'
import { aboutDialog } from './about-dialog.es6'
import { messageBox } from './message-box.es6'
import { divider } from './divider.es6'
import { toolButton } from './tool-button.es6'
import { sideBarTab } from './side-bar-tab.es6'
import { projectManager } from './project-manager.es6'

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
    LOG('[about]')
/*    
    var fetch = require('isomorphic-fetch'); // or another library of choice.
    var Dropbox = require('dropbox').Dropbox;
    var dbx = new Dropbox({ accessToken: 'xzg77AnvTaAAAAAAAAAAJ64v0EczA3xqe-H-fZOLi6aBKp6oNmw3I-fH1eSuHmBz', fetch: fetch });
    dbx.filesListFolder({path: ''})
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
    return
*/

//  dialog.open(aboutDialog)
//  return
    
    dialog.open(messageBox, {
      title: '認証',
      message: 'ノートの保存にはDropboxのアカウントが必要です。<br>ログインしますか？',
      ok: 'ログイン',
      cancel: 'キャンセル',
    }).then((responce) => {
      WARN('...', responce)
      location.href='http://www.asahi.com'
    }).catch((error) => {
      ERROR('...', error)
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
  
  openDialog() {
    if (namenote.app) {
      namenote.app.openDialog().then((url) => {
        WARN(`openDialog '${url}'...`)
        projectManager.open(url)

      }).then((project) => {
        //WARN('project=', project)
        
      }).catch((error) => {
        if (error) {
          dialog.open(messageBox, {
            type: 'error',
            message: error
          })
        }
      })
    }
  }

  open(url) {
    LOG('open...')
    projectManager.open(url)
  }

  openNewDialog() {
    WARN('open new dialog..')
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
