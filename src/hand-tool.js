import { Tool } from './tool.js';
import { namenote } from './namenote.js';
import { history } from './history.js';
import { autosave } from './autosave.js';
import { toolManager } from './tool-manager.js';


class HandTool extends Tool {
  constructor() {
    super();
    this.name = 'hand';
  }

  onDown(x, y) {
    console.log(this.name + 'onDown');
  }

  onUp(stroke) {
    console.log(this.name + 'onUp');
    toolManager.pop();
  }

  onMove(x, y) {
  }
}

export { HandTool };
