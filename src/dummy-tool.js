import { Tool } from './tool.js';
import { toolManager } from './tool-manager.js';

class DummyTool extends Tool {
  constructor() {
    super();
    this.name = 'dummy';
  }

  onDown(x, y) {
    console.log(this.name, 'onDown');
  }
  
  onUp(stroke) {
    console.log(this.name, 'onUp');
    toolManager.pop();
  }

  onMove(x, y) {
    console.log(this.name, 'onMove');
  }
}

export { DummyTool };
