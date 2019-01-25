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
    penButton = $('#pen-button').imageButton({
      src: 'img/pen-button.png',
      locked: true,
      float: 'left',
      click: function(e) {
        if ($(e.target).imageButton('instance')) {
          this.select('pen')
        }
      }.bind(this),
      content: htmlDropdown.make('penDropDown', 'pen')
    })[0]
    
    eraserButton = $('#eraser-button').imageButton({
      src: 'img/eraser-button.png',
      float: 'left',
      click: function(e) {
        if ($(e.target).imageButton('instance')) {
          this.select('eraser')
        }
      }.bind(this),
      content: htmlDropdown.make('eraserDropDown', 'eraser')
    })[0]

    textButton = $('#text-button').imageButton({
      src: 'img/text-button.png',
      float: 'left',
      click: function(e) {
        if ($(e.target).imageButton('instance')) {
          this.select('text')
        }
      }.bind(this),
      content: htmlDropdown.make('textDropDown', 'text')
    })[0]

    this.buttons.push(penButton, eraserButton, textButton)
  }

  update() {
  }

  select(name) {
    for (const button of this.buttons) {
      const locked = $(button).imageButton('locked')
      
      if (button && button.id.indexOf(name) == 0) {
        if (!locked) {
          $(button).imageButton('locked', true)
        }
      } else {
        if (locked) {
          $(button).imageButton('locked', false)
        }
      }
    }
  }
}

const toolButton = new ToolButton()

export { toolButton }
