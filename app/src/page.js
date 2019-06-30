import { namenote } from './namenote.js';
import { Text } from './text.js';

const JSZip = require('JSZip');


class Page {
  constructor(project, pid) {
    this.pid = pid;
    this.width = project.pageSize[0];
    this.height = project.pageSize[1];

    this.project = project; //updateThumbnailでしか使わない。削除できるはず
  }

  destructor() {
    LOG('page destructor', this.pid);
    this.project = null;
  }
  
  async init(data) {
    this.params = data
    this.canvas = this.createCanvasElement(this.width, this.height);
    this.canvasCtx = this.canvas.getContext('2d');
    await this.unzip(this.canvasCtx);
    this.updateThumbnail(this.project);
    this.texts = this.getTexts(this.params.text);
  }

  initBlank() {
    this.params = { text: "" };
    this.canvas = this.createCanvasElement(this.width, this.height);
    this.canvasCtx = this.canvas.getContext('2d');
    this.updateThumbnail(this.project);
    this.texts = this.getTexts(this.params.text);
  }

  updateThumbnail(project) {
    const rect = project.getThumbnailSize();
    this.thumbnail = this.createCanvasElement(rect.width, rect.height);
    this.thumbnailCtx = this.thumbnail.getContext('2d');
    this.thumbnailCtx.filter = 'none';
    this.thumbnailCtx.imageSmoothingQuality = 'high';
    this.thumbnailCtx.drawImage(this.canvas,
      project.canvasSize[2] || 0, project.canvasSize[3] || 0,
      project.canvasSize[0], project.canvasSize[1],
      0, 0, rect.width, rect.height);
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
    return (this.params) ? true : false;
  }
  
  getTexts(text) {
    const result = document.createElement('div');

    if (text) {
      result.innerHTML = text;
      result.childNodes.forEach((p) => {
        $(p).removeClass('editable');
        $(p).removeClass('selected');
        $(p).css('color', '');

        p.id = namenote.getUniqueID();
        p.innerHTML = Text.cleanup(p.innerHTML)
//      p.innerHTML = p.innerHTML
//        .replace(/\r|\n/g, '')
//        .replace(/(<([^>]+)>)/g, '/')
//        .replace(/\/+/g, '/')
//        .replace(/^\//, '')
//        .replace(/\/$/, '')
//        .replace(/\//g, '<br>');
      });
    }
    return result;
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
