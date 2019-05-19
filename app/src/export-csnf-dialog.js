import { dialog } from './dialog.js'
import { file } from './file.js'

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

