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
    console.log(this.name + 'onDown');
    if (!namenote.mainView) return;
    const canvas = namenote.mainView.drawingLayer.canvas;
    if (canvas) {
      this.ctx = canvas.getContext('2d');
      this.addPoint(x, y);
    }
  }

  onUp(stroke) {
    console.log(this.name + ' onUp');
    if (this.ctx) {
      this.draw(stroke);
      this.ctx = null;
    }
  }

  onMove(x, y) {
    //console.log(this.name + ' onMove');
    if (this.ctx) {
      this.addPoint(x, y);
    }
  }

  addPoint(x, y) {
    const mainView = namenote.mainView;
    const scale = mainView.scale;

    const w = 5 * scale;
    const left = x - mainView.drawingLayer.offsetX - w / 2;
    const top = y - mainView.drawingLayer.offsetY - w / 2;

    this.ctx.fillStyle = '#ff0000';
    this.ctx.fillRect(left, top, w, w);
  }

  draw(stroke) {
    const project = namenote.mainView.project;
    if (project) {
      const page = project.currentPage;
      if (page && page.loaded) {
        this.drawPage(page, stroke);
      }
      namenote.mainView.drawingLayer.clear();
    }
  }

  drawPage(page, stroke) {
    console.log('drawPage', page);

    const mainView = namenote.mainView;
    const pageRect = mainView.getPageRect(mainView.project.currentPage.pid);
    const pageOffsetX = pageRect.x - mainView.content.scrollLeft;
    const pageOffsetY = pageRect.y - mainView.content.scrollTop;

    const dx = mainView.drawingLayer.offsetX + pageOffsetX;
    const dy = mainView.drawingLayer.offsetY + pageOffsetY;
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
}

export { PenTool };
