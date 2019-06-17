import { namenote } from './namenote.js';
import { Page } from './page.js';
import { projectManager } from './project-manager.js';
import { file } from './file.js';
import { config } from './config.js';
import { shape } from './shape.js';

const thumbnailWidths = {
  small: 50, // 75,
  middle: 100, // 106,
  large: 150
};

// //////////////////////////////////////////////////////////////

class Project {
  constructor(url, json) {
    //  url = url.replace(/\\/g, '/') //TODO:Windows対応は必要だがここは不適当
    this.url = url;
    this.baseURL = url.replace(/\/[^/]*$/, '');

    this.pages = [];
    this.currentPage = null;

    this.views = [];

    //  this.finishPageRead = false
    //  this.maxPID = 0
    //  this.dirty = true

    if (json) {
      this.init(json);
    }
  }

  destructor() {
    log('project destructor', this.url);
    this.pages.forEach(page => {
      page.destructor();
    });

    this.views = [];
  }

  init(data) {
    this.params = data.params;
    this._pids = data.pids;

    shape.setDPI(this.params.dpi);
    this.pageSize = shape.topx(this.params.page_size || [257, 364]);
    this.canvasSize = shape.topx(this.params.canvas_size || this.params.export_size || [257, 364]);
    return this;
  }

  pids(update) {
    /*
    if (update) {
      this._pids = []
      this.pages.forEach((page, index) => {
        this._pids.push(page.pid)
        WARN(index, page.pid)
      })
      }
    */
    return this._pids; // ここは挿入とか削除のたびにあれしないとだめだ
  }

  name() {
    return file.truncateURL(this.url);
  }

  addView(view) {
    if (this.views.indexOf(view) < 0) {
      this.views.push(view);
    }
  }

  removeView(view) {
    this.views = this.views.filter((item) => {
      return item !== view;
    });
  }

  setCurrentPage(pid) {
    LOG('setCurrentPage', pid)

    if (this.currentPage) {
      $('#page-' + this.currentPage).removeClass('selected');
    }
    this.currentPage = pid;
    $('#page-' + pid).addClass('selected');
  }
  
  draftMarks() {
    const options = { color: '#85bffd', dpi: this.dpi };
    const arr = shape.parse([
      // 100=rectangle
      // 1=lineWidth(px)
      // x,y,width,height(mm)
      [100, 1, 0, 0, 257, 364],
      [100, 1, 19, 27, 220, 310],
      [100, 1, 39, 47, 180, 270]
    ], options);

    const width = shape.topx(this.canvasSize[0]);
    const height = shape.topx(this.canvasSize[1]);
    const string = `
      <svg class="marks" width="${width}" height="${height}">
        ${arr.join('')}
      </svg>`;
    return $(string)[0];
  }

  getThumbnailSize() {
    const size = config.getValue('thumbnailSize');
    const thumbnailWidth = thumbnailWidths[size];
    const scale = thumbnailWidth / this.canvasSize[0];

    const width = Math.ceil(this.canvasSize[0] * scale);
    const height = Math.ceil(this.canvasSize[1] * scale);
    return { width: width, height: height };
  }
}

export { Project };
