import { namenote } from './namenote.js';
import { Page } from './page.js';
import { projectManager } from './project-manager.js';
import { pageManager } from './page-manager.js';
import { file } from './file.js';
import { config } from './config.js';
import { shape } from './shape.js';
import { Text } from './text.js';

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
    this.views = [];

    this.currentPage = null;
    this.currentTexts = [];

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
    console.log('set current page', pid);
    if (this.currentPage !== pid) {
      this.clearCurrentPage();
      this.currentPage = pid;
      this.views.forEach((view) => view.onSetCurrentPage(pid));
    }
  }

  clearCurrentPage() {
    console.log('clear current page');
    if (this.currentPage) {
      this.clearCurrentText();
      this.views.forEach((view) => view.onClearCurrentPage());
      this.currentPage = null;
    }
  }

  addCurrentText(tid) {
    if (this.currentTexts.indexOf(tid) < 0) {
      this.currentTexts.push(tid);
      this.views.forEach((view) => view.onAddCurrentText(tid));
    }
  }

  clearCurrentText() {
    this.views.forEach((view) => view.onClearCurrentText());
    this.currentTexts = [];
  }

  setCurrentText(tid) {
    this.clearCurrentText();
    this.addCurrentText(tid);
  }

  getTID(node) {
    const id = node.id;
    return parseInt(id.replace(/^p/, ''), 10);
  }

  findTextIndex(page, id) {
    if (page) {
      const nodes = page.texts.childNodes;
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === id) return i;
      }
    }
    return -1;
  }

  currentPageIndex() {
    const pid = this.currentPage;
    return this.pages.findIndex((page) => page.pid === pid);
  }

  currentTextIndex() {
    const id = 'p' + this.currentTexts[0];
    const page = this.pages.find((page) => page.pid === this.currentPage);
    return this.findTextIndex(page, id);
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

  async getNewPID() {
    let max = await file.getMaxPID(this.baseURL);
    this.pages.forEach((page) => {
      if (max < page.pid) {
        max = page.pid;
      }
    });
    return max + 1;
  }

  getThumbnailSize() {
    const size = config.getValue('thumbnailSize');
    const thumbnailWidth = thumbnailWidths[size];
    const scale = thumbnailWidth / this.canvasSize[0];

    const width = Math.ceil(this.canvasSize[0] * scale);
    const height = Math.ceil(this.canvasSize[1] * scale);
    return { width: width, height: height };
  }

  // Actions

  movePage(from, to) {
    const page = this.pages.splice(from, 1)[0];
    this.pages.splice(to, 0, page);
  }

  addPage(pid, to) {
    const page = pageManager.get(this, pid);
    this.pages.splice(to, 0, page);
    this.setCurrentPage(pid);
  }

  removePage(pid, from) {
    if (this.pages.length <= 1) return;
    this.pages.splice(from, 1)[0];

    const index = (from > 0) ? (from - 1) : 0;
    this.setCurrentPage(this.pages[index].pid);
  }

  moveText(from, to, fromPID, toPID) {
    const fromPage = this.pages.find(page => page.pid === fromPID);
    const toPage = this.pages.find(page => page.pid === toPID);
    if (!fromPage || !toPage) return;

    const node = fromPage.texts.childNodes[from];
    fromPage.texts.removeChild(node);
    toPage.texts.insertBefore(node, toPage.texts.childNodes[to]);
  }

  addText(text, to, toPID) {
    const toPage = this.pages.find(page => page.pid === toPID);
    if (!toPage) return;

    const node = $(text)[0];
    toPage.texts.insertBefore(node, toPage.texts.childNodes[to]);

    this.setCurrentText(this.getTID(node));
  }

  removeText(text, from, fromPID) {
    const fromPage = this.pages.find(page => page.pid === fromPID);
    if (!fromPage) return;

    const node = fromPage.texts.childNodes[from];
    fromPage.texts.removeChild(node);

    if (fromPage.texts.childNodes.length > 0) {
      const index = (from > 0) ? from - 1 : 0;
      this.setCurrentText(this.getTID(fromPage.texts.childNodes[index]));
    }
  }

  editText(toText, index, pid) {
    const page = this.pages.find(page => page.pid === pid);
    if (!page) return;

    const fromNode = page.texts.childNodes[index];

    const toNode = $(toText)[0];
    Text.cleanup(toNode);
//  $(toNode).removeClass('selected');
//  console.log(toNode);

    page.texts.replaceChild(toNode, fromNode);
  }

  editImage(toImage, rect, pid) {
    const page = this.pages.find(page => page.pid === pid);
    if (!page) return;

    page.putImage(rect, toImage);
  }
}

export { Project };
