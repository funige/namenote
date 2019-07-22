import { Tool } from './tool.js';
import { controller } from './controller.js';
import { namenote } from './namenote.js';
import { history } from './history.js';
import { action } from './action.js';


class PenTool extends Tool {
  constructor() {
    super();
    this.name = 'pen';
  }

  onDown(x, y) {
    if (!namenote.mainView) return;
    this.drawingLayer = namenote.mainView.drawingLayer;
    if (!this.drawingLayer) return;

    if (this.drawingLayer.canvas) {
      this.ctx = this.drawingLayer.canvas.getContext('2d');
      this.scale = namenote.mainView.scale;
      this.addPoint(x, y);
    }
  }

  onUp(stroke) {
    this.draw(stroke);
  }

  onMove(x, y) {
    if (this.ctx) {
      this.addPoint(x, y);
    }
  }

  addPoint(x, y) {
    const mainView = namenote.mainView;
    const scale = mainView.scale;
    x -= this.drawingLayer.offsetX;
    y -= this.drawingLayer.offsetY;

    const width = 5 * scale;
    this.drawingLayer.ctx.fillStyle = '#ff0000';
    this.drawingLayer.ctx.fillRect(x - width / 2, y - width / 2, width, width);
  }

  draw(stroke) {
    const mainView = namenote.mainView;
    const project = mainView.project;
    if (!project) return;

    const scale = mainView.scale;
    const page = project.currentPage;
    if (!page) return;

    const pageRect = mainView.getPageRect(mainView.project.currentPageIndex());
    const pageOffsetX = pageRect.x - mainView.content.scrollLeft;
    const pageOffsetY = pageRect.y - mainView.content.scrollTop;

    const dx = this.drawingLayer.offsetX + pageOffsetX;
    const dy = this.drawingLayer.offsetY + pageOffsetY;

    stroke.map(point => {
      point[0] = (point[0] - dx) / scale;
      point[1] = (point[1] - dy) / scale;
    })

    const width = 5;
    const rect = this.getBound(stroke, width);
    const fromImage = page.getImage(rect);
    
    stroke.forEach(point => {
      page.canvasCtx.fillStyle = '#000000';
      page.canvasCtx.fillRect(point[0] - width/2, point[1] - width/2, width, width);
    });

    const toImage = page.getImage(rect);
    const blankImage = fromImage; //とりあえず
    const pid = page.pid;
    const url = project.url;

    const record = [];
    record.push(['editImage', fromImage, toImage, rect, pid, url]);
    console.warn(record);
    history.pushUndo(record);
    //action.play(record);
    mainView.onEditImage(toImage, rect, pid);

    this.drawingLayer.clear();
  }

  getBound(stroke, width) {
    let tmp = null;

    stroke.forEach(point => {
      const x = point[0];
      const y = point[1];

      if (tmp) {
        if (tmp[0] > x) tmp[0] = x;
        if (tmp[1] > y) tmp[1] = y;
        if (tmp[2] < x) tmp[2] = x;
        if (tmp[3] < y) tmp[3] = y;

      } else {
        tmp = [x, y, x, y];
      }
    });

    return {
      x: Math.floor(tmp[0] - width / 2),
      y: Math.floor(tmp[1] - width / 2),
      width: Math.ceil(tmp[2] - tmp[0] + width + 1),
      height: Math.ceil(tmp[3] - tmp[1] + width + 1)
    };
  }
}

export { PenTool };
