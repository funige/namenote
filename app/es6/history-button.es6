'use strict'

import { command } from './command.es6'
import { projectManager } from './project-manager.es6'

let undoButton
let redoButton

////////////////////////////////////////////////////////////////

class HistoryButton {
  constructor() {
  }

  init() {
    undoButton = $('#undo-button').imgButton({
      src: 'img/undo-button.png',
      float: 'left',
      disabled: true,
      click: function(e) {
        command.undo()
      }
    })[0]

    redoButton = $('#redo-button').imgButton({
      src: 'img/redo-button.png',
      float: 'left',
      disabled: true,
      click: function(e) {
        command.redo()
      }
    })[0]
  }

  update() {
    const project = projectManager.current
    
    if (project) {
      const hasUndo = (project) ? project.history.hasUndo() : false
      const hasRedo = (project) ? project.history.hasRedo() : false
      $(undoButton).imgButton('disabled', !hasUndo)
      $(redoButton).imgButton('disabled', !hasRedo)

//    Menu.updateHistory()
    }
  }
}

const historyButton = new HistoryButton()

export { historyButton }
