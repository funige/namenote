'use strict'

import { Project } from './project.es6'
import { PageBuffer } from './page-buffer.es6'
import { RecentURL } from './recent-url.es6'
import { Text } from './text.es6'
import { Tool } from './tool.es6'
import { command } from './command.es6'
import { menuTemplate, fileMenuTemplate, otherMenuTemplate } from './menu-template.es6'


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

  // HTMLMenu
  const li = findHTMLSubmenu($('#menu-menu')[0], label)
  if (li) {
    if (value) {
      li.classList.remove('ui-state-disabled')
    } else {
      li.classList.add('ui-state-disabled')
    }
  }
}

function setShortcut(template, label, isEditable) {
  const item = findSubmenu(template, label)
  if (item) {
    if (isEditable) delete(item.accelerator)
  }
}

function findHTMLSubmenu(node, label) {
  for (let li of node.childNodes) {
    const tmp = li.getElementsByTagName('div')
    if (tmp.length > 0 && tmp[0].title == label) return li

    const submenu = li.getElementsByTagName('ul')
    if (submenu.length > 0) {
      const result = findHTMLSubmenu(submenu[0], label)
      if (result) return result
    }
  }
  return null
}

////////////////////////////////////////////////////////////////

class Menu {}

Menu.rebuild = (template) => {
  if (namenote.isApp) {
    namenote.app.rebuildMenu(template)
  }
}


Menu.init = () => {
  Menu.update()
}

Menu.update = (element) => {
  const template = JSON.parse(JSON.stringify(menuTemplate))

  Menu.updateRecents(template)
  Menu.updateWindows(template)
  
  Menu.updateEnabled(template)
  Menu.updateShortcut(template, element)
  Menu.rebuild(template)
}

Menu.updateRecents = (template) => {
  const recents = findSubmenu(template, 'Open Recent').submenu
  for (let item of RecentURL.list) {
    recents.push({
      label: item, data: item, click: 'openURL'
    })
  }
  if (recents.length > 0) {
    recents[0].accelerator = "F1" //"CmdOrCtrl+0"
  }
  Menu.updateRecentsHTML()
}

Menu.updateWindows = (template) => {
  const windows = findSubmenu(template, 'Window').submenu
  const project = Project.current
  for (let item of Project.list) {
    windows.unshift({
      label: item.url, data: item.url, click: 'openURL',
      type: 'checkbox',
      checked: (project && item.url == project.url),
    })
  }
  Menu.updateWindowsHTML()
}

Menu.updateRecentsHTML = () => {
  const fileMenu = $('#file-menu')
  const ul = fileMenu[0]

  while (ul.childNodes.length > 3) {
    ul.removeChild(ul.childNodes[ul.childNodes.length - 1])
  }
  
  for (let item of RecentURL.list) {
    const li = document.createElement('li')
    const div = document.createElement('div')
    li.appendChild(div)
    div['data-data'] = item
    div['data-click'] = 'openURL'
    div.innerHTML = item
    ul.appendChild(li)
  }
  fileMenu.menu('refresh')
}

Menu.updateWindowsHTML = () => {
  const menuMenu = $('#menu-menu')
  const ul = menuMenu[0].childNodes[4].childNodes[1]

  while (ul.childNodes.length > 0) {
    ul.removeChild(ul.childNodes[ul.childNodes.length - 1])
  }

  for (let item of Project.list) {
    const li = document.createElement('li')
    const div = document.createElement('div')
    li.appendChild(div)
    div['data-data'] = item.url
    div['data-click'] = 'openURL'
    div.innerHTML = item.url
    ul.insertBefore(li, ul.childNodes[0])
  }
  menuMenu.menu('refresh')
}

Menu.updateEnabled = (template) => {
  const project = Project.current
  if (project) {
    enableItem(template, 'Undo', project.history.hasUndo())
    enableItem(template, 'Redo', project.history.hasRedo())
    enableItem(template, 'Close', true)
    enableItem(template, 'Close All', true)
    enableItem(template, 'Save Snapshot As ...', true)
    enableItem(template, 'Note Settings ...', true)
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
    enableItem(template, 'Note Settings ...', false)
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

Menu.getMenuHTML = (template, id) => {
  const node = document.createElement('div')
  node.className = 'dropdown-content'
  node.id = id + '-dropdown'
  Menu.addMenuHTML(node, template)

  node.childNodes[0].id = id + '-menu'
  return node.outerHTML
}

Menu.addMenuHTML = (node, template) => {
  const ul = document.createElement('ul')
  node.appendChild(ul)

  for (let item of template) {
    const li = document.createElement('li')
    const div = document.createElement('div')
    li.appendChild(div)
    
    div['data-data'] = item.label
    div['data-click'] = item.click
    div.innerHTML = T(item.label || '-')

    if (item.submenu) {
      Menu.addMenuHTML(li, item.submenu)
    }
    ul.appendChild(li)
  }
}

Menu.onselect  = (event, ui) => {
  const div = ui.item[0] && ui.item[0].childNodes[0]
  if (div) {
    const data = div['data-data']
    const click = div['data-click']
    nn.warn('onselect..', ui, data, click)

    if (click) {
      command.do(`${click}`, `${data}`)
      return true
    }
  }
  return false
}

export { Menu }
