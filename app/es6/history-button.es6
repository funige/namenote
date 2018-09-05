'use strict'

import { Tool } from './tool.es6'
import { Project } from './project.es6'
import { command } from './command.es6'
import { Menu } from './menu.es6'

let undoButton
let redoButton


const historyButton = {}

historyButton.init = () => {
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

historyButton.update = () => {
  const project = Project.current
  if (project) {
    const hasUndo = (project) ? project.history.hasUndo() : false
    const hasRedo = (project) ? project.history.hasRedo() : false
    $(undoButton).imgButton('disabled', !hasUndo)
    $(redoButton).imgButton('disabled', !hasRedo)

    Menu.updateHistory()
  }
}


export { historyButton }
