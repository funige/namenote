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
    this.drawingLayer = namenote.mainView.drawingLayer;
    if (!this.drawingLayer) return;

    if (this.drawingLayer.canvas) {
      this.ctx = this.drawingLayer.canvas.getContext('2d');
      this.scale = namenote.mainView.scale;
      this.putPoint();
    }
  }

  onUp(e) {
    this.drawingLayer.draw();
  }

  onMove(e) {
    if (this.ctx) {
      this.putPoint();
    }
  }


  putPoint() {
    const x = controller.x - this.drawingLayer.offsetX;
    const y = controller.y - this.drawingLayer.offsetY;
    const width = 5 * this.scale;
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(x - width / 2, y - width / 2, width, width);
  }
}

export { PenTool };
