import { Tool } from './tool.js';
import { controller } from './controller.js';
import { namenote } from './namenote.js';


class PenTool extends Tool {
  constructor() {
    super();
    this.name = 'pen';
  }

  onDown(e) {
    if (!namenote.mainView) return;
    this.scratch = namenote.mainView.scratch;
    if (!this.scratch) return;
    
    if (this.scratch.canvas) {
      this.ctx = this.scratch.canvas.getContext('2d');
      this.scale = namenote.mainView.scale;
      this.putPoint();
    }
  }

  onUp(e) {
    this.scratch.submit();
  }

  onMove(e) {
    if (this.ctx) {
      this.putPoint();
    }
  }


  putPoint() {
    const x = controller.x - this.scratch.offsetX;
    const y = controller.y - this.scratch.offsetY;
    const width = 10 * this.scale;
    this.ctx.fillStyle = '#0000ff';
    this.ctx.fillRect(x, y, width, width);
  }
}

export { PenTool };
