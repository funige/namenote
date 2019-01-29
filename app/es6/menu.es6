'use strict'

import { namenote } from './namenote.es6'
import { menuTemplate } from './menu-template.es6'
import { recentURL } from './recent-url.es6'
import { htmlMenu } from './html-menu.es6'
import { projectManager } from './project-manager.es6'

let template
let states = {}

const findSubmenu = (template, label) => {
  for (const item of template) {
    if (item.label == label) {
      return item
    }
    if (item.submenu) {
      const result = findSubmenu(item.submenu, label)
      if (result) return result
    }
  }
  return null
}

const setState = (template, label, value) => {
  const item = findSubmenu(template, label)
  if (item) {
    value = (value) ? true : false

    item.enabled = value
    if (item.submenu) {
      if (!value) delete(item.submenu)
    }
    states[label] = value
  }
}

////////////////////////////////////////////////////////////////

class Menu {
  constructor() {
  }

  init() {
    this.update()
  }

  update() {
    template = JSON.parse(JSON.stringify(menuTemplate))
    states = {}
    
    this.updateRecents(template)
    this.updateStates(template)
    this.rebuild(template)
  }

  rebuild(template) {
    if (namenote.app) {
      namenote.app.rebuildMenu(template)
    }
  }

  updateRecents(template) {
    const recents = findSubmenu(template, 'Open Recent').submenu
    for (const item of recentURL.data) {
      recents.push({
        label: item, data: item, click: 'openURL'
      })
    }
  }

  updateStates(template) {
    const isApp = (namenote.app) ? true : false
    setState(template, 'Full Screen', isApp || window.chrome)
    setState(template, 'Developer Tools', isApp)
    setState(template, 'Open ...', isApp)

    const project = projectManager.current
    const isProject = (project) ? true : false
    setState(template, 'Close', isProject)
    setState(template, 'Close All', isProject)
    setState(template, 'Save Snapshot As ...', isProject)
    setState(template, '.txt (Plain Text) ...', isProject)
    setState(template, '.csnf (CLIP STUDIO Storyboard) ...', isProject)
    setState(template, '.pdf (PDF) ...', isProject)
    
    setState(template, 'Add', isProject)
    setState(template, 'Move to Buffer', isProject)
    setState(template, 'Put Back from Buffer', isProject)
    setState(template, 'Empty Buffer', isProject)
    setState(template, 'Move Forward', isProject)
    setState(template, 'Move Backward', isProject)
    setState(template, 'Extract Text', isProject)
    setState(template, 'Save Image As ...', isProject)

    setState(template, 'Undo', isProject) // && project.history.hasUndo())
    setState(template, 'Redo', isProject) // && project.history.hasRedo())
  }

  getState(label) {
    return states[label]
  }
}

const menu = new Menu()

export { menu }
