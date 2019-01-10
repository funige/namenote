'use strict'

import { command } from './command.es6'
import { htmlDropdown } from './html-dropdown.es6'

let penButton
let eraserButton
let textButton

////////////////////////////////////////////////////////////////

class ToolButton {
  constructor() {
    this.buttons = []
  }

  init() {
    penButton = $('#pen-button').imgButton({
      src: 'img/pen-button.png',
      locked: true,
      float: 'left',
      click: function(e) {
        if ($(e.target).imgButton('instance')) {
          this.select('pen')
        }
      }.bind(this),
      content: htmlDropdown.make('penDropDown', 'pen')
    })[0]
    
    eraserButton = $('#eraser-button').imgButton({
      src: 'img/eraser-button.png',
      float: 'left',
      click: function(e) {
        if ($(e.target).imgButton('instance')) {
          this.select('eraser')
        }
      }.bind(this),
      content: htmlDropdown.make('eraserDropDown', 'eraser')
    })[0]

    textButton = $('#text-button').imgButton({
      src: 'img/text-button.png',
      float: 'left',
      click: function(e) {
        if ($(e.target).imgButton('instance')) {
          this.select('text')
        }
      }.bind(this),
      content: htmlDropdown.make('textDropDown', 'text')
    })[0]

    this.buttons.push(penButton, eraserButton, textButton)
  }

  update() {
  }

  select(tool) {
    for (const button of this.buttons) {
      const locked = $(button).imgButton('locked')
      const dropdown = $(button).find('.dropdown-content')[0]
      
      if (button && button.id.indexOf(tool) == 0) {
        if (!locked) {
          $(button).imgButton('locked', true)
        }
      } else {
        if (locked) {
          $(button).imgButton('locked', false)
        }
      }
    }
  }
}

const toolButton = new ToolButton()

export { toolButton }
