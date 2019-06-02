import { dialog } from './dialog.js'
import { Project } from './project.js'
import { Page } from './page.js'

import { projectManager } from './project-manager.js'

import { MessageForm } from './message-form.js'

////////////////////////////////////////////////////////////////

class FileSystem {
  constructor() {
  }

  auth() {
    return true
  }
  
  logout() {
  }
}

export { FileSystem }
