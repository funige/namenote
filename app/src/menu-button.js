import { command } from './command.js'
import { projectManager } from './project-manager.js'
import { htmlMenu } from './html-menu.js'
import { menu } from './menu.js'

import { fileMenuTemplate,
         dockMenuTemplate } from './menu-template.js'

let fileButton
let dockButton

////////////////////////////////////////////////////////////////

class MenuButton {
  constructor() {
    this.buttons = []
  }

  init() {
    fileButton = $('#file-menu-button').imageButton({
      src: 'img/file-button.png',
      float: 'left',
      click: (e) => { this.select(e) },
      content: htmlMenu.make(fileMenuTemplate, 'file')
    })[0]

    dockButton = $('#dock-menu-button').imageButton({
      src: 'img/menu-button.png',
      float: 'right',
      click: (e) => { this.select(e) },
      content: htmlMenu.make(dockMenuTemplate, 'dock'),
      contentParent: $('body')[0]
    })[0]

    this.buttons.push(fileButton, dockButton)
  }

  update() {
  }
  
  select(e) {
    if (e.target.className.indexOf('img-button') < 0) return
    if ($(e.target).imageButton('disabled')) return

    for (const button of this.buttons) {
      const locked = $(button).imageButton('locked')
      const instance = $(button).imageButton('instance')
      if (!instance) continue
      
      const dropdown = instance.options.content
      if (button && button.id == e.target.id) {
        if (!locked) {
          htmlMenu.update(dropdown)
          
          $(button).imageButton('locked', true)
          if (instance.options.contentParent) {
            instance.updateContentPosition()
          }
          htmlMenu.open(dropdown)

        } else {
          $(button).imageButton('locked', false)
          htmlMenu.close(dropdown)
        }

      } else {
        if (locked) {
          $(button).imageButton('locked', false)
          htmlMenu.close(dropdown)
        }
      }
    }
  }
}

const menuButton = new MenuButton()

export { menuButton }
