import { dialog } from './dialog.js'
import { Project } from './project.js'
import { Page } from './page.js'

import { projectManager } from './project-manager.js'

import { MessageBox } from './message-box.js'

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
