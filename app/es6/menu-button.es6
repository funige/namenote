'use strict'

import { command } from './command.es6'
import { projectManager } from './project-manager.es6'
import { htmlMenu } from './html-menu.es6'
import { menu } from './menu.es6'

import { fileMenuTemplate,
         otherMenuTemplate,
         sidebarMenuTemplate } from './menu-template.es6'

let fileButton
let otherButton
let sidebarButton

////////////////////////////////////////////////////////////////

class MenuButton {
  constructor() {
    this.buttons = []
  }

  init() {
    fileButton = $('#file-menu-button').imageButton({
      src: 'img/file-button.png',
      float: 'left',
      click: function(e) { this.select(e) }.bind(this),
      content: htmlMenu.make(fileMenuTemplate, 'file')
    })[0]
/*
    otherButton = $('#other-menu-button').imageButton({
      src: 'img/menu-button.png',
      float: 'right',
      click: function(e) { this.select(e) }.bind(this),
      content: htmlMenu.make(otherMenuTemplate, 'other')
    })[0]
*/
    sidebarButton = $('#sidebar-menu-button').imageButton({
      src: 'img/menu-button.png',
      float: 'right',
      click: function(e) { this.select(e) }.bind(this),
      content: htmlMenu.make(sidebarMenuTemplate, 'sidebar'),
      contentParent: $('body')[0]
    })[0]

    this.buttons.push(fileButton, sidebarButton)
  }

  update() {
  }
  
  select(e) {
    if (e.target.className.indexOf('img-button') < 0) return
    if ($(e.target).imageButton('disabled')) return

    for (const button of this.buttons) {
      const locked = $(button).imageButton('locked')
      const instance = $(button).imageButton('instance')
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
