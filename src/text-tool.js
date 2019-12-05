import { Tool } from './tool.js';
import { namenote } from './namenote.js';
import { history } from './history.js';
import { autosave } from './autosave.js';
import { toolManager } from './tool-manager.js';
import { pointer } from './pointer.js';
import { command } from './command.js';


class TextTool extends Tool {
  constructor() {
    super();
    this.name = 'text';
  }

  onDown(x, y) {
    console.log(this.name, 'onDown');
    this.x0 = x;
    this.y0 = y;
  }

  onUp(stroke) {
    console.log(this.name, 'onUp');
    if (!pointer.isMoved()) {
      this.addTextAt(this.x0, this.y0);
      console.log('add text');
    }
    toolManager.pop();
  }

  onMove(x, y) {
  }

  addTextAt(x, y) {
    const project = namenote.mainView.project;
    const page = project.currentPage;
    if (page) {
      command.addText(project, page.texts.length - 1, page.pid, () => {
        command.toggleEditable();
      });
    }
  }
}

export { TextTool };
