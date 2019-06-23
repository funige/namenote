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
    this.pids = data.pids;

    shape.setDPI(this.params.dpi);
    this.pageSize = shape.topx(this.params.page_size || [257, 364]);
    this.canvasSize = shape.topx(this.params.canvas_size || this.params.export_size || [257, 364]);
    return this;
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
    namenote.mainView.showCurrentPage(pid);
    namenote.pageView.showCurrentPage(pid);
    namenote.textView.showCurrentPage(pid);
    this.currentPage = pid;
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

  movePage(from, to) {
    const page = this.pages.splice(from , 1)[0]
    this.pages.splice(to, 0, page)

    const pid = this.pids.splice(from, 1)[0]
    this.pids.splice(to, 0, pid)
  }

  moveText(from, to, fromPID, toPID) {
    const fromPage = this.pages.find(page => page.pid === fromPID)
    const toPage = this.pages.find(page => page.pid === toPID)
    if (!fromPage || !toPage) return

    const text = fromPage.texts.childNodes[from]
    fromPage.texts.removeChild(text)
    toPage.texts.insertBefore(text, toPage.texts.childNodes[to])

    //  const text = fromPage.texts.childNodes[from]
    //if ((fromPage === toPage) && (from < to)) {
    //  to += 1;
    //}
  }
}

export { Project };
