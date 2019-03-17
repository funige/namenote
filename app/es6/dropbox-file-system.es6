'use strict'

import { namenote } from './namenote.es6'
import { FileSystem } from './file-system.es6'

import { flash } from './flash.es6'
import { dialog } from './dialog.es6'
import { messageBox } from './message-box.es6'
import { openDialog } from './open-dialog.es6'

////////////////////////////////////////////////////////////////

class DropboxFileSystem extends FileSystem {
  constructor() {
    super()
    this.type = "dropbox"
  }

  openDialog() {
    if (!this.auth('openDialog')) return
    WARN(`openDialog..`)
    
    dialog.open(openDialog).then((url) => {
      return this.readProject(url)

    }).then((project) => {

      /*
      project._pids.forEach((pid, index) => {
        const pageURL = `${project.baseURL}/${pid}.json`
        this.readPage(pageURL).then((page) => {
          page.pid = pid
          project.pages[index] = page
          
        }).catch((error) => { WARN(error) })
      })
      return project
*/
    }).catch((error) => dialog.alert(error))
  }
  
  ////////////////

  stat(url, callback) {
    if (!this.auth()) return
    return this.fs.stat(url, callback)
  }
  
  readdir(url, callback) {
    if (!this.auth()) return
    return this.fs.readdir(url, { mode: 'stat' }, callback)
  }

  readFile(url, callback) {
    if (!this.auth()) return
    return this.fs.readFile(url, 'utf8', callback)
  }

  writeFile(url, data, callback) {
    if (!this.auth()) return
    return this.fs.writeFile(url, data, 'utf8', callback)
  }
  
  ////////////////

  auth(item, data) {
    const accessToken = localStorage.getItem('namenote/raw_token')
    if (accessToken) {
      if (!this.fs) {
        this.fs = require('dropbox-fs')({ apiKey: accessToken })
      }
      return true
    }

    dialog.open(messageBox, {
      title: 'Authenticate',
      message: 'Namenote would like access to the files in your Dropbox.',
      ok: 'Connect to Dropbox',
      cancel: 'Cancel',

    }).then((responce) => {
      dialog.current.showProgress(T('Connecting ...'))
      var Dropbox = require('dropbox').Dropbox;
      var dbx = new Dropbox({ clientId: 'cex5vkoxd9nwj48'})
      var authUrl = (location.href.indexOf('localhost') < 0) ?
          'https://funige.github.io/namenote/auth':
          'http://localhost:8080/namenote/auth'

      flash.save(item, data)
      location.href = dbx.getAuthenticationUrl(authUrl)

    }).catch((error) => { dialog.alert(error) })

    return false
  }

  logout() {
    this.fs = null
    localStorage.removeItem('namenote/raw_token')
    dialog.open(messageBox, {
      title: 'Logout',
      message: 'Disconnected.',
    }).then(() => {
      dialog.close()
    })
  }
}

export { DropboxFileSystem }
