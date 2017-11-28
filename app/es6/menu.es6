'use strict'

import { Project } from './project.es6'
import { PageBuffer } from './page-buffer.es6'
import { RecentURL } from './recent-url.es6'
import { Text } from './text.es6'
import { menuTemplate, menuTemplateTrial } from './menu-template.es6'


function findSubmenu(template, label) {
  for (let item of template) {
    if (item.label == label) {
      return item
    }
    if (item.submenu) {
      const result = findSubmenu(item.submenu, label);
      if (result) return result
    }
  }
  return null
}

function enableItem(template, label, value) {
  const item = findSubmenu(template, label)
  if (item) {
    item.enabled = value
    if (item.submenu) {
      if (!value) delete(item.submenu)
    }
  }
}

function setShortcut(template, label, isEditable) {
  const item = findSubmenu(template, label)
  if (item) {
    if (isEditable) delete(item.accelerator)
  }
}

////////////////////////////////////////////////////////////////

class Menu {}

Menu.menuTemplate = menuTemplate

Menu.init = () => {
  $('#menu').menu()
  
  if (namenote.isTrial) {
    Menu.menuTemplate = menuTemplateTrial
  }
  if (namenote.isApp) {
    namenote.app.rebuildMenu(Menu.menuTemplate)
  }
  Menu.update()
}

Menu.update = (element) => {
  const template = JSON.parse(JSON.stringify(Menu.menuTemplate))
  const recents = findSubmenu(template, 'Open Recent').submenu
  const windows = findSubmenu(template, 'Window').submenu
  const project = Project.current
  
  for (let item of RecentURL.list) {
    recents.push({
      label: item, data: item, click: 'openURL'
    })
  }
  for (let item of Project.list) {
    windows.unshift({
      label: item.url, data: item.url, click: 'openURL',
      type: 'checkbox',
      checked: (project && item.url == project.url),
    })
  }
  
  Menu.updateEnabled(template)
  Menu.updateShortcut(template, element)

  if (namenote.isApp) {
    namenote.app.rebuildMenu(template)
  }
}

Menu.updateEnabled = (template) => {
  const project = Project.current
  if (project) {
    enableItem(template, 'Undo', project.history.hasUndo())
    enableItem(template, 'Redo', project.history.hasRedo())
    enableItem(template, 'Close', true)
    enableItem(template, 'Close All', true)
    enableItem(template, 'Save Snapshot As ...', true)
    enableItem(template, 'Export', true)
    enableItem(template, 'Import', true)

    enableItem(template, 'Add', true)
    enableItem(template, 'Move to Buffer', true)
    enableItem(template, 'Put Back from Buffer', PageBuffer.hasPage())
    enableItem(template, 'Empty Buffer', PageBuffer.hasPage())
    enableItem(template, 'Duplicate', true)
    enableItem(template, 'Move Forward', true)
    enableItem(template, 'Move Backward', true)
    enableItem(template, 'Flip', true)
    enableItem(template, 'Extract Text', true)
    enableItem(template, 'Save Image As ...', true)
    
  } else {
    enableItem(template, 'Undo', false)
    enableItem(template, 'Redo', false)
    enableItem(template, 'Close', false)
    enableItem(template, 'Close All', false)
    enableItem(template, 'Save Snapshot As ...', false)
    enableItem(template, 'Export', false)
    enableItem(template, 'Import', false)

    enableItem(template, 'Add', false)
    enableItem(template, 'Move to Buffer', false)
    enableItem(template, 'Put Back from Buffer', false)
    enableItem(template, 'Empty Buffer', false)
    enableItem(template, 'Duplicate', false)
    enableItem(template, 'Move Forward', false)
    enableItem(template, 'Move Backward', false)
    enableItem(template, 'Flip', false)
    enableItem(template, 'Extract Text', false)
    enableItem(template, 'Save Image As ...', false)
  }  
}

Menu.updateShortcut = (template, element) => {
  const isEditable = Text.isEditable(element)
  setShortcut(template, 'Add', false)
  setShortcut(template, 'Move to Buffer', false)
  setShortcut(template, 'Put Back from Buffer', false)
  setShortcut(template, 'Empty Buffer', false)
  setShortcut(template, 'Duplicate', false)
  setShortcut(template, 'Move Forward', false)
  setShortcut(template, 'Move Backward', false)
  setShortcut(template, 'Flip', isEditable)
  setShortcut(template, 'Page Margin', isEditable)
}

export { Menu }
