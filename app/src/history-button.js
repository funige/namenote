import { command } from './command.js'
import { projectManager } from './project-manager.js'
import { namenote } from './namenote.js'

let undoButton
let redoButton

////////////////////////////////////////////////////////////////

class HistoryButton {
  constructor() {
  }

  init() {
    undoButton = $('#undo-button').imageButton({
      src: 'img/undo-button.png',
      float: 'left',
      disabled: true,
      click: function(e) {
        command.undo()
      }
    })[0]

    redoButton = $('#redo-button').imageButton({
      src: 'img/redo-button.png',
      float: 'left',
      disabled: true,
      click: function(e) {
        command.redo()
      }
    })[0]
  }

  update() {
    const project = namenote.currentProject()
    
    if (project) {
      const hasUndo = (project) ? project.history.hasUndo() : false
      const hasRedo = (project) ? project.history.hasRedo() : false
      $(undoButton).imageButton('disabled', !hasUndo)
      $(redoButton).imageButton('disabled', !hasRedo)

//    Menu.updateHistory()
    }
  }
}

const historyButton = new HistoryButton()

export { historyButton }
