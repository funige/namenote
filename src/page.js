import { namenote } from './namenote.js';
import { Text } from './text.js';
import { file } from './file.js';


const JSZip = require('jszip');

class Page {
  constructor(project, pid, isBlank) {
    this.project = project;
    this.pid = pid;
    this.url = `${project.baseURL}/${pid}.json`;
    this.width = project.pageSize.width;
    this.height = project.pageSize.height;

    if (!isBlank) {
      file.readJSON(this.url)
        .then((json) => this.init(json))
        .catch((err) => console.log(err));
    } else {
      this.init();
    }
  }

  destructor() {
    console.log('page destructor', this.pid);

    this.project = null;
  }

  async init(data) {
    this.params = data || {};
    this.canvas = this.createCanvasElement(this.width, this.height);
    this.canvasCtx = this.canvas.getContext('2d');
    await this.unzipImage(this.canvasCtx, this.params.base64);

    this.updateThumbnail();
    this.texts = this.initTexts(this.params.text);
    this.loaded = true;
    this.project.views.forEach(view => {
      view.initPageData(this, this.project.pages.indexOf(this));
      view.initPage(this);
    });
  }

  updateThumbnail() {
    const rect = this.project.getThumbnailSize();
    this.thumbnail = this.createCanvasElement(rect.width, rect.height);
    this.thumbnailCtx = this.thumbnail.getContext('2d');
    this.thumbnailCtx.imageSmoothingQuality = 'high';
    this.thumbnailCtx.drawImage(
      this.canvas,
      this.project.canvasSize.x || 0,
      this.project.canvasSize.y || 0,
      this.project.canvasSize.width,
      this.project.canvasSize.height,
      0, 0, rect.width, rect.height
    );
  }

  createCanvasElement(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  unzipImage(ctx, base64) {
    return new Promise((resolve, reject) => {
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

  zipImage(ctx) {
    return new Promise((resolve, reject) => {
      const imageData = ctx.getImageData(0, 0, this.width, this.height);
      //    console.log('...', imageData.data.buffer, this.width, this.height);

      const zip = new JSZip();
      zip.file('image', imageData.data.buffer, { createFolders: false, binary: true });
      zip.generateAsync({
        type: 'base64',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }

      }).then((content) => {
        //      console.log('zipped:', this.pid, content);
        resolve(content);
      });
    });
  }

  initTexts(html) {
    const elements = document.createElement('div');
    elements.innerHTML = html;
    const texts = Text.toTexts(elements);
    texts.map((text) => {
      if (!text.key) text.key = namenote.getUniqueID();
    })
    return texts;
  }
  
  getImage(rect) {
    return this.canvasCtx.getImageData(rect.x, rect.y, rect.width, rect.height);
  }

  putImage(rect, image) {
    this.canvasCtx.putImageData(image, rect.x, rect.y);
  }

  digest() {
    if (!this.params || !this.params.text) return '';

    const result = this.texts.map((text) => {
      return text.innerHTML
                 .replace(/(<([^>]+)>)/ig, '/')
                 .replace(/\/+/g, '/')
                 .replace(/^\//, '').replace(/\/$/, '');
    }).join('/');
    //return result;
    return `${result}<br>${this.pid}.json`;
  }

  async makeData() {
    this.params.base64 = await this.zipImage(this.canvasCtx);
    this.params.pid = this.pid;
    this.params.text = Text.toElements(this.texts).innerHTML;
    //this.params.layers = [];
    return $.extend({}, this.params);
  }

  async save() {
    const data = await this.makeData();
    await file.writeJSON(this.url, data);

    console.warn(`[save ${this.url}]`);
  }
}

export { Page };
