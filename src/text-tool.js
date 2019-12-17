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

    const mainView = namenote.mainView;
    const pageRect = mainView.getPageRect(mainView.project.currentPage.pid);
    const pageOffsetX = pageRect.x - mainView.content.scrollLeft;
    const pageOffsetY = pageRect.y - mainView.content.scrollTop;
    const dx = mainView.drawingLayer.offsetX + pageOffsetX;
    const dy = mainView.drawingLayer.offsetY + pageOffsetY;

    const scale = mainView.scale;
    this.x0 = (x - dx) / scale;
    this.y0 = (y - dy) / scale;
  }

  onUp(stroke) {
    console.log(this.name, 'onUp');
    if (!pointer.isMoved()) {
      this.addTextAt(this.x0, this.y0);
      console.log('add text', this.x0, this.y0);
    }
    toolManager.pop();
  }

  onMove(x, y) {
  }

  addTextAt(x, y) {
    const project = namenote.mainView.project;
    const page = project.currentPage;
    if (page) {
      command.addText(project, page.texts.length - 1, page.pid, x, y, () => {
        command.toggleEditable();
      });
    }
  }
}

export { TextTool };
