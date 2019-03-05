'use strict'

import { namenote } from './namenote.es6'
import { FileSystem } from './file-system.es6'

import { flash } from './flash.es6'
import { dialog } from './dialog.es6'
import { messageBox } from './message-box.es6'

let fs = null

////////////////////////////////////////////////////////////////

class DropboxFileSystem extends FileSystem {
  constructor() {
    super()
    this.type = "dropbox"
  }

  stat(url, callback) {
    if (!fs) return
    return fs.stat(url, callback)
  }
  
  readdir(url, callback) {
    if (!fs) return
    return fs.readdir(url, { mode: 'stat' }, callback)
  }
    
  open(url) {
    if (!fs && !this.auth('open', url)) return

    this.completePath(url).then((url) => {
      WARN(`open ${url}..`)
    }).catch((error) => dialog.alert(error))
  }

  auth(item, data) {
    const accessToken = localStorage.getItem('namenote/raw_token')
    if (accessToken) {
      fs = require('dropbox-fs')({ apiKey: accessToken })
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
    fs = null
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
