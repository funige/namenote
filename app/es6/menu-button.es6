'use strict'

import { command } from './command.es6'
import { projectManager } from './project-manager.es6'
import { htmlMenu } from './html-menu.es6'
import { menu } from './menu.es6'

import { fileMenuTemplate, otherMenuTemplate } from './menu-template.es6'

let fileButton
let otherButton

////////////////////////////////////////////////////////////////

class MenuButton {
  constructor() {
    this.buttons = []
  }

  init() {
    fileButton = $('#file-menu-button').imgButton({
      src: 'img/file-button.png',
      float: 'left',
      click: function(e) { this.select(e) }.bind(this),
      content: htmlMenu.make(fileMenuTemplate, 'file')
    })[0]

    otherButton = $('#other-menu-button').imgButton({
      src: 'img/menu-button.png',
      float: 'right',
      click: function(e) { this.select(e) }.bind(this),
      content: htmlMenu.make(otherMenuTemplate, 'other')
    })[0]

    this.buttons.push(fileButton, otherButton)
  }

  update() {
  }
  
  select(e) {
    if (e.target.className.indexOf('img-button') < 0) return
    if ($(e.target).imgButton('disabled')) return

    for (const button of this.buttons) {
      const locked = $(button).imgButton('locked')
      const dropdown = $(button).find('.dropdown-content')[0]

      if (button && button.id == e.target.id) {
        if (!locked) {
          htmlMenu.update(dropdown)
          
          $(button).imgButton('locked', true)
          htmlMenu.open(dropdown)

        } else {
          $(button).imgButton('locked', false)
          htmlMenu.close(dropdown)
        }

      } else {
        if (locked) {
          $(button).imgButton('locked', false)
          htmlMenu.close(dropdown)
        }
      }
    }
  }
}

const menuButton = new MenuButton()

export { menuButton }
