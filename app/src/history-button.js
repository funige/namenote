import { command } from './command.js';
import { projectManager } from './project-manager.js';
import { namenote } from './namenote.js';
import { history } from './history.js';

let undoButton;
let redoButton;

// //////////////////////////////////////////////////////////////

class HistoryButton {
  constructor() {
  }

  init() {
    undoButton = $('#undo-button').imageButton({
      src: 'img/undo-button.png',
      float: 'left',
      disabled: true,
      click: function (e) {
        command.undo();
      }
    })[0];

    redoButton = $('#redo-button').imageButton({
      src: 'img/redo-button.png',
      float: 'left',
      disabled: true,
      click: function (e) {
        command.redo();
      }
    })[0];
  }

  update() {
    const project = namenote.currentProject();

    const hasUndo = project && history.hasUndo()
    const hasRedo = project && history.hasRedo()
    $(undoButton).imageButton('disabled', !hasUndo);
    $(redoButton).imageButton('disabled', !hasRedo);
  }
}

const historyButton = new HistoryButton();

export { historyButton };
