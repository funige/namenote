'use strict'

import { Project } from './project.es6'
import { PageBuffer } from './page-buffer.es6'
import { RecentURL } from './recent-url.es6'
import { Text } from './text.es6'
import { Tool } from './tool.es6'
import { helper } from './helper.es6'
import { command } from './command.es6'
import { menuTemplate, fileMenuTemplate, otherMenuTemplate } from './menu-template.es6'

let template

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

  enableItemHTML($('#menu-menu')[0], label, value)
}

function enableItemHTML(node, label, value) {
  const li = findHTMLSubmenu(node, label)
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
    const tmp = li.getElementsByTagName('p')
    if (tmp.length > 0) {
      if (tmp[0].innerHTML == label) return li
    }

    const submenu = li.getElementsByTagName('ul')
    if (submenu.length > 0) {
      const result = findHTMLSubmenu(submenu[0], label)
      if (result) return result
    }
  }
  return null
}

function appendAttribute(div, data, click) {
  if (data) {
    const p = document.createElement('p')
    p.innerHTML = data
    p.title = click || ''
    p.style.display = 'none'
    div.appendChild(p)
  }
  return div
}

function appendKey(string, key, check) {
  check = (check) ? '&#x2714;' : ''
  key = convertKey(key) || '&nbsp;'

  const result = `
     <div class='check'>${check}</div>
     <div class='label'>${string}</div>
     <div class='key'>${key}</div>`
  return result
}

function convertKey(key) {
  if (key) {
    if (!helper.isMac()) {
      if (key.indexOf('Command+Ctrl+F') >= 0) return ''
      
      key = key.replace(/Shift\+\,/, 'Shift+Comma')
      key = key.replace(/Shift\+\./, 'Shift+Period')
      key = key.replace(/CmdOrCtrl\+/, 'Ctrl+')
      key = key.replace(/Command\+Alt\+/, 'Ctrl+Alt+')
      key = key.replace(/Command\+Ctrl\+/, '???+')
      key = key.toUpperCase()

    } else {
      key = key.replace(/Shift\+\,/, '<')
      key = key.replace(/Shift\+\./, '>')
      key = key.replace(/CmdOrCtrl\+/, '&#8984;')
      key = key.replace(/Command\+Alt\+/, '&#8997;&#8984;')
      key = key.replace(/Command\+Ctrl\+/, '&#8963;&#8984;')
      key = key.replace(/Shift\+/, '&#8679;')
      key = key.toUpperCase()
    }
  }
  return key
}

////////////////////////////////////////////////////////////////

class Menu {}

Menu.rebuild = (template) => {
  if (namenote.isApp) {
    namenote.app.rebuildMenu(template)
  }
}


Menu.init = () => {
  if (!helper.isMac()) {
    helper.addRule('.ui-menu div.key', 'color', '#ccc')
    helper.addRule('.ui-menu .ui-widget', 'width', '350px')
  }

  Menu.update()
}

Menu.update = (element) => {
  template = JSON.parse(JSON.stringify(menuTemplate))
  
  Menu.updateRecents(template)
  Menu.updateWindows(template)
  
  Menu.updateEnabled(template)
  Menu.updateShortcut(template, element)
  Menu.rebuild(template)
}

Menu.updateHistory = (element) => {
  if (!template) {
    return Menu.update(element)
  }

  Menu.updateEnabledHistory(template)
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

  const df = document.createDocumentFragment();
  for (let item of RecentURL.list) {
    const li = document.createElement('li')
    const div = document.createElement('div')
    div.innerHTML = item
    li.appendChild(appendAttribute(div, item, 'openURL'))
    df.appendChild(li)
  }
  ul.appendChild(df)
  
/*  
  for (let item of RecentURL.list) {
    const li = document.createElement('li')
    const div = document.createElement('div')
    div.innerHTML = item
    li.appendChild(appendAttribute(div, item, 'openURL'))
    
    ul.appendChild(li)
  }
*/
  
  fileMenu.menu('refresh')
}

Menu.updateWindowsHTML = () => {
  const project = Project.current
  const menuMenu = $('#menu-menu')
  const li = menuMenu[0].childNodes[3]
  const hasWindows = (Project.list.length > 0) ? true : false
  enableItemHTML(menuMenu[0], 'Window', hasWindows)

  if (hasWindows) {
    const ul = li.childNodes[1]

    while (ul.childNodes.length > 0) {
      ul.removeChild(ul.childNodes[ul.childNodes.length - 1])
    }

    const df = document.createDocumentFragment();
    for (let item of Project.list) {
      const li = document.createElement('li')
      const div = document.createElement('div')
      div.innerHTML = appendKey(item.url, null, project && item.url == project.url)
      li.appendChild(appendAttribute(div, item.url, 'openURL'))
      df.insertBefore(li, df.childNodes[0])
    }
    ul.appendChild(df)
    
/*
    for (let item of Project.list) {
      const li = document.createElement('li')
      const div = document.createElement('div')

      div.innerHTML = appendKey(item.url, null, project && item.url == project.url)
      li.appendChild(appendAttribute(div, item.url, 'openURL'))
      ul.insertBefore(li, ul.childNodes[0])
    }
*/
  }
  menuMenu.menu('refresh')
}

Menu.updateEnabled = (template) => {
  const project = Project.current
  if (project) {
    enableItem(template, 'Close', true)
    enableItem(template, 'Close All', true)
    enableItem(template, 'Save Snapshot As ...', true)
    enableItem(template, 'Export', true)
    enableItem(template, 'Import', true)

    enableItem(template, 'Add', true)
    enableItem(template, 'Move to Buffer', true)
    enableItem(template, 'Put Back from Buffer', PageBuffer.hasPage())
    enableItem(template, 'Empty Buffer', PageBuffer.hasPage())
    enableItem(template, 'Move Forward', true)
    enableItem(template, 'Move Backward', true)
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
    enableItem(template, 'Move Forward', false)
    enableItem(template, 'Move Backward', false)
    enableItem(template, 'Extract Text', false)
    enableItem(template, 'Save Image As ...', false)
  }  
  Menu.updateEnabledHistory(template)
}

Menu.updateEnabledHistory = (template) => {
  const project = Project.current
  if (project) {
    enableItem(template, 'Undo', project.history.hasUndo())
    enableItem(template, 'Redo', project.history.hasRedo())
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
    if (item.label) {
      div.innerHTML = appendKey(T(item.label), item.accelerator)
    } else {
      div.innerHTML = '-'
    }
    
    li.appendChild(appendAttribute(div, item.label, item.click))

    if (item.submenu) {
      Menu.addMenuHTML(li, item.submenu)
    }
    ul.appendChild(li)
  }
}

Menu.onselect  = (event, ui) => {
  const p = ui.item[0] && ui.item[0].getElementsByTagName('p')[0]
  if (p) {
    const data = p.innerHTML
    const click = p.title

    if (click) {
      command.do(`${click}`, `${data}`)
      return true
    }
  }
  return false
}

export { Menu }
