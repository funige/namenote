'use strict'

import { FileSystem } from './file-system.es6'
import { dialog } from './dialog.es6'
import { openNewDialog } from './open-new-dialog.es6'
import { openDialog } from './open-dialog.es6'

const fs = window.require('fs-extra')

////////////////////////////////////////////////////////////////

class LocalFileSystem extends FileSystem {
  constructor() {
    super()
    this.type = "local"
  }

  stat(url, callback) {
    return fs.stat(url, callback)
  }

  readdir(url, callback) {
    return fs.readdir(url, { withFileTypes: true }, callback)
  }

  openNewDialog() {
    dialog.open(openNewDialog).then((url) => {
      WARN(`open new ${url}..`)
      dialog.close()
    }).catch((error) => dialog.alert(error))
  }
  
  openDialog() {
    dialog.open(openDialog).then((url) => {
      WARN(`open ${url}..`)
      dialog.close()
    }).catch((error) => dialog.alert(error))
  }
  
  open(url) {
    this.completePath(url).then((url) => {
      WARN(`open ${url}..`)
    }).catch((error) => dialog.alert(error))
  }

  accessToken() { return null }
  logout() {}
}

export { LocalFileSystem }
