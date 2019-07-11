import { Tool } from './tool.js';
import { controller } from './controller.js';
import { namenote } from './namenote.js';


class PenTool extends Tool {
  constructor() {
    super();
    this.name = 'pen';
  }

  onDown(e) {
    const scratch = namenote.mainView.scratch;
    if (scratch.canvas) {
      const canvas = scratch.canvas;
      const x = controller.x - scratch.offsetX;
      const y = controller.y - scratch.offsetY;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#0000ff';
      ctx.fillRect(x, y, 10, 10);
    }
  }

  onUp(e) {
  }

  onMove(e) {
  }
}

export { PenTool };
