'use strict'

import { dialog } from './dialog.es6'
import { Project } from './project.es6'
import { Page } from './page.es6'

import { projectManager } from './project-manager.es6'

import { MessageBox } from './message-box.es6'

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
