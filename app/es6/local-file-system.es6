'use strict'

import { FileSystem } from './file-system.es6'
import { dialog } from './dialog.es6'
import { openNewDialog } from './open-new-dialog.es6'
import { openDialog } from './open-dialog.es6'

////////////////////////////////////////////////////////////////

class LocalFileSystem extends FileSystem {
  constructor() {
    super()
    this.fs = window.require('fs')
    this.type = "local"
  }
  
  ////////////////

  stat(url, callback) {
    return this.fs.stat(url, callback)
  }

  readdir(url, callback) {
    return this.fs.readdir(url, { withFileTypes: true }, callback)
  }

  readFile(url, callback) {
    return this.fs.readFile(url, 'utf8', callback)
  }

  writeFile(url, data, callback) {
    return this.fs.writeFile(url, data, 'utf8', callback)
  }
}

export { LocalFileSystem }
