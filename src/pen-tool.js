import { Tool } from './tool.js';
import { namenote } from './namenote.js';
import { history } from './history.js';
import { autosave } from './autosave.js';


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

    const w = 5 * scale;
    const left = x - this.drawingLayer.offsetX - w / 2;
    const top = y - this.drawingLayer.offsetY - w / 2;

    this.drawingLayer.ctx.fillStyle = '#ff0000';
    this.drawingLayer.ctx.fillRect(left, top, w, w);
  }

  draw(stroke) {
    const project = namenote.mainView.project;
    if (project) {
      const page = project.currentPage;
      if (page && page.loaded) {
        this.drawPage(page, stroke);
      }
    }
    this.drawingLayer.clear();
  }

  drawPage(page, stroke) {
    console.log('drawPage', page);

    const mainView = namenote.mainView;
    const pageRect = mainView.getPageRect(mainView.project.currentPage.pid);
    const pageOffsetX = pageRect.x - mainView.content.scrollLeft;
    const pageOffsetY = pageRect.y - mainView.content.scrollTop;

    const dx = this.drawingLayer.offsetX + pageOffsetX;
    const dy = this.drawingLayer.offsetY + pageOffsetY;
    const scale = mainView.scale;
    stroke.forEach(point => {
      point[0] = (point[0] - dx) / scale;
      point[1] = (point[1] - dy) / scale;
    });

    const w = 5;
    const rect = this.getBound(stroke, w);
    const fromImage = page.getImage(rect);

    stroke.forEach(point => {
      page.canvasCtx.fillStyle = '#000000';
      page.canvasCtx.fillRect(point[0] - w / 2, point[1] - w / 2, w, w);
    });
    page.updateThumbnail();

    const toImage = page.getImage(rect);
    const pid = page.pid;
    const url = page.project.url;

    const record = [];
    record.push(['editImage', fromImage, toImage, rect, pid, url]);
    history.pushUndo(record);

    autosave.push(page);
    page.project.views.forEach((view) => {
      view.onEditImage(toImage, rect, pid);
    });
  }

  getBound(stroke, w) {
    let xmin = stroke[0][0];
    let ymin = stroke[0][1];
    let xmax = xmin;
    let ymax = ymin;

    stroke.forEach(point => {
      const x = point[0];
      const y = point[1];

      if (x > xmax) xmax = x;
      if (y > ymax) ymax = y;
      if (x < xmin) xmin = x;
      if (y < ymin) ymin = y;
    });

    const rect = {
      x: Math.floor(xmin - w / 2),
      y: Math.floor(ymin - w / 2),
      width: Math.ceil(xmax - xmin + w + 1),
      height: Math.ceil(ymax - ymin + w + 1)
    };
    console.warn('getBound', rect);
    return rect;
  }
}

export { PenTool };
