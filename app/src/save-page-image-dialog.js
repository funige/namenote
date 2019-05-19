import { dialog } from './dialog.js'
import { file } from './file.js'

////////////////////////////////////////////////////////////////

class SavePageImageDialog {
  constructor() {
    this.id = 'save-page-image-dialog'
  }

  destructor() {
    this.element = null
  }

  init() {
    return Promise.resolve()
  }
}

export { SavePageImageDialog }

