import { namenote } from './namenote.js';
import { Text } from './text.js';
import { file } from './file.js';


const JSZip = require('jszip');

class Page {
  constructor(project, pid, isBlank) {
    this.pid = pid;
    this.project = project;
    this.width = project.pageSize[0];
    this.height = project.pageSize[1];

    if (isBlank) {
      this.initBlank();
    } else {
      const url = `${project.baseURL}/${pid}.json`;
      this.load(url);
    }
  }

  destructor() {
    console.log('page destructor', this.pid);
    this.project = null;
  }

  load(url) {
    file.readJSON(url).then((json) => {
      this.init(json).then(() => {
        this.project.views.forEach((view) => {
          view.initPage(this);
        });
      });
    }).catch((error) => {
      this.initBlank();
      this.project.views.forEach((view) => {
        view.initPage(this);
      });
    });
  }

  async init(data) {
    this.params = data;
    this.canvas = this.createCanvasElement(this.width, this.height);
    this.canvasCtx = this.canvas.getContext('2d');
    await this.unzip(this.canvasCtx);
    this.updateThumbnail(this.project);
    this.texts = this.getTexts(this.params.text);
  }

  initBlank() {
    this.params = {}; // text: '' };
    this.canvas = this.createCanvasElement(this.width, this.height);
    this.canvasCtx = this.canvas.getContext('2d');
    this.updateThumbnail(this.project);
    this.texts = this.getTexts(this.params.text);
  }

  updateThumbnail(project) {
    const rect = project.getThumbnailSize();
    this.thumbnail = this.createCanvasElement(rect.width, rect.height);
    this.thumbnailCtx = this.thumbnail.getContext('2d');
    if (this.thumbnailCtx) {
      this.thumbnailCtx.filter = 'none';
      this.thumbnailCtx.imageSmoothingQuality = 'high';
      this.thumbnailCtx.drawImage(
        this.canvas,
        project.canvasSize[2] || 0, project.canvasSize[3] || 0,
        project.canvasSize[0], project.canvasSize[1],
        0, 0, rect.width, rect.height
      );
    }
  }

  createCanvasElement(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  unzip(ctx) {
    return new Promise((resolve, reject) => {
      const base64 = this.params.base64;
      if (!base64) return resolve();

      const zip = new JSZip();
      zip.loadAsync(base64, { base64: true }).then((zip) => {
        zip.file('image').async('uint8Array').then((data) => {
          const imageData = ctx.createImageData(this.width, this.height);
          imageData.data.set(data);
          ctx.putImageData(imageData, 0, 0);
          resolve();
        });
      });
    });
  }

  loaded() {
    return !!(this.params);
  }

  getTexts(text) {
    const result = document.createElement('div');
    if (text) {
      result.innerHTML = text;
      result.childNodes.forEach((p) => {
        Text.cleanup(p);
        p.id = namenote.getUniqueID();
      });
    }
    return result;
  }

  getImage(rect) {
    return this.canvasCtx.getImageData(rect.x, rect.y, rect.width, rect.height);
  }

  putImage(rect, image) {
    this.canvasCtx.putImageData(image, rect.x, rect.y);
  }

  digest() {
    if (!this.params || !this.params.text) return '';

    return this.params.text
      .replace(/(<([^>]+)>)/ig, '/')
      .replace(/\/+/g, '/')
      .replace(/^\//, '').replace(/\/$/, '');
  }
}

export { Page };
