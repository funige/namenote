'use strict'

import { command } from './command.es6'

let pageButton
let textButton

////////////////////////////////////////////////////////////////

class SideBarTab {
  constructor() {
    this.buttons = []
  }

  init() {
    pageButton = $('#page-view-button').textButton({
      text: T('Pages'),
      locked: true,
      click: function(e) {
        if ($(e.target).textButton('instance')) {
          command.showPageView()
        }
      }.bind(this),
    })[0]

    textButton = $('#text-view-button').textButton({
      text: T('Texts'),
      click: function(e) {
        if ($(e.target).textButton('instance')) {
          command.showTextView()
        }
      }.bind(this),
    })[0]

    this.buttons.push(pageButton, textButton)
  }

  update() {
  }

  select(name) {
    for (const button of this.buttons) {
      const locked = $(button).textButton('locked')

      if (button && button.id.indexOf(name) == 0) {
        if (!locked) {
          $(button).textButton('locked', true)
        }
      } else {
        if (locked) {
          $(button).textButton('locked', false)
        }
      }
    }
  }
}

const sideBarTab = new SideBarTab()

export { sideBarTab }
