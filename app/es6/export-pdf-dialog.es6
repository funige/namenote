'use strict'

import { dialog } from './dialog.es6'
import { file } from './file.es6'

////////////////////////////////////////////////////////////////

class ExportPDFDialog {
  constructor() {
    this.id = 'export-pdf-dialog'
  }

  destructor() {
    this.element = null
  }

  init() {
    return Promise.resolve()
  }
}

export { ExportPDFDialog }

