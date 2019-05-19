import { dialog } from './dialog.js'
import { file } from './file.js'

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

