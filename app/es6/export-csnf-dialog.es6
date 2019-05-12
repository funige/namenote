'use strict'

import { dialog } from './dialog.es6'
import { file } from './file.es6'

////////////////////////////////////////////////////////////////

class ExportCSNFDialog {
  constructor() {
    this.id = 'export-csnf-dialog'
  }

  destructor() {
    this.element = null
  }

  init() {
    return Promise.resolve()
  }
}

export { ExportCSNFDialog }

