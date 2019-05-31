import { namenote } from './namenote.js'
import { command } from './command.js'
import { recentURL } from './recent-url.js'
import { menu as nativeMenu } from './menu.js'
import { file } from './file.js'

let buttons = {}
let listeners = {}

const addItems = (node, items) => {
  const ul = document.createElement('ul')

  for (let item of items) {
    const li = document.createElement('li')
    const div = document.createElement('div')
    if (item.label) {
      div.innerHTML = appendKey(T(item.label), item.accelerator, item.checked)
    } else {
      div.innerHTML = '-'
    }
    li.appendChild(appendAttribute(div, item.label, item.click))
    if (item.submenu) {
      addItems(li, item.submenu) 
    }

    ul.appendChild(li)
    node.appendChild(ul)
  }
}

const appendAttribute = (div, data, click) => {
  if (data) {
    const p = document.createElement('p')
    p.innerHTML = data
    p.title = click || ''
    p.style.display = 'none'
    div.appendChild(p)
  }
  return div
}

const appendKey = (string, key, check) => {
  check = (check) ? '&#x2714;' : ''
  key = convertKey(key) || '&nbsp;' 

  const result = `
    <div class='check'>${check}</div>
    <div class='label'>${string}</div>
    <div class='key'>${key}</div>`
  return result
}

const convertKey = (key) => {
  if (key) {
    if (!namenote.isMac()) {
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

const getLabel = (url) => {
  const label = file.getLabel(url)
  return `<span class="ui-icon ${label.icon}"></span>${label.text}`
}

////////////////////////////////////////////////////////////////

class HTMLMenu {
  constructor() {
  }

  init() {
  }

  open(element) {
    element.style.opacity = '1'
    element.style.display = 'block'

    const id = element.id.replace(/-.*$/, '')
    document.addEventListener('click', listeners[id])
  }

  close(element) {
    element.style.display = 'none'
  }
  
  make(template, id) {
    const content = document.createElement('div')
    content.className = 'dropdown-content'
    content.id = id + '-dropdown'

    addItems(content, template)
    setTimeout(() => {
      this.activate(content.childNodes[0], id)
    }, 1)
   
    return content
  }

  activate(menu, id) {
    menu.id = id + '-menu'
    buttons[id] = $('#' + id + '-menu-button')
    listeners[id] = this.getListener(menu, id)

    $(menu).menu({
      select: function(event, ui) {
        if (this.select(event, ui)) {
          this.collapse(menu, id)
          document.removeEventListener('click', listeners[id])
          buttons[id].imageButton('locked', false)
        }
      }.bind(this)
    })

  }

  collapse(menu, id) {
    $(menu).menu('collapseAll', null, true)
    menu.parentNode.style.opacity = '0.01'
    setTimeout(() => {
      this.close(menu.parentNode)
      buttons[id].imageButton('locked', false)
    }, 500)
  }
  
  getListener(menu, id) {
    return (e) => {
      let element = e.target
      while (element) {
        if (element.id == id + '-menu' ||
            element.id == id + '-menu-button') {
          return
        }
        element = element.parentNode
      }
      
      WARN('collapse', id + '-menu', this, menu)
      this.collapse(menu, id)
      document.removeEventListener('click', listeners[id])
    }
  }
  
  ////////////////

  update(element) {
    const menu = element.childNodes[0]
    const id = element.id.replace(/-.*$/, '')

    if (id == 'file') {
      this.updateRecents(menu)
    }
    this.updateStates(menu)
    $(menu).menu('refresh')
  }

  isSeparator(item) {
    if (item) {
      if (item.childNodes[0] && item.childNodes[0].innerHTML != '-') {
        return false
      }
    }
    return true
  }

  updateRecents(menu) {
    while (!this.isSeparator(menu.childNodes[2])) {
      menu.removeChild(menu.childNodes[2])
    }
    
    const df = document.createDocumentFragment()
    for (const item of recentURL.data) {
      const li = document.createElement('li')
      const div = document.createElement('div')
      div.innerHTML = getLabel(item)
      li.title = item
      li.appendChild(appendAttribute(div, item, 'open'))
      df.appendChild(li)
    }
    //menu.appendChild(df)
    menu.insertBefore(df, menu.childNodes[2])
  }

  updateStates(menu) {
    const items = $(menu).find('li')
    for (const item of items) {
      const name = $(item).find('p')
      if (name && name.length == 1) {
        const label = name[0].innerHTML
        const state = nativeMenu.getEnabled(label)
        if (state !== undefined) {
          if (state) {
            item.classList.remove('ui-state-disabled')
          } else {
            item.classList.add('ui-state-disabled')
          }
        }
      }
    }
  }

  ////////////////
  
  select(event, ui) {
    const p = ui.item[0] && ui.item[0].getElementsByTagName('p')[0]
    if (p) {
      const data = p.innerHTML
      const click = p.title

      if (click) {
        command.do(click, data)
        return true
      }
    }
    return false
  }
}

const htmlMenu = new HTMLMenu()

export { htmlMenu }
