import { pageManager } from './page-manager.js';
import { file } from './file.js';
import { shape } from './shape.js';
import { Text } from './text.js';
import { command } from './command.js';

const thumbnailWidths = {
  small: 50,
  middle: 100,
  large: 150
};


class Project {
  constructor(url, json) {
    //  url = url.replace(/\\/g, '/') //TODO:Windows対応は必要だがここは不適当
    this.url = url;
    this.baseURL = url.replace(/\/[^/]*$/, '');

    this.pages = [];
    this.views = [];

    this.currentPage = null;
    this.currentKeys = [];

    if (json) {
      this.init(json);
    }
  }

  destructor() {
    console.log('project destructor', this.url);
    this.pages.forEach(page => {
      page.destructor();
    });

    this.views = [];
  }

  init(data) {
    this.params = data.params;
    this.pids = data.pids;

    shape.setDPI(this.params.dpi);

    this.pageSize = {};
    [this.pageSize.width, this.pageSize.height] = shape.topx(
      this.params.page_size || [257, 364]
    );

    this.canvasSize = {};
    [this.canvasSize.width, this.canvasSize.height] = shape.topx(
      this.params.canvas_size || this.params.export_size || [257, 364]
    );

    //とりあえず動くように
    if (!this.params.sheet_size) {
    this.params.sheet_size = [257, 364];
    }
    return this;
  }

  name() {
    return file.truncateURL(this.url);
  }

  path() {
    return this.url.split(this.name())[0];
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

  setCurrentPage(page) {
    if (this.currentPage !== page) {
      this.clearCurrentPage();
      this.currentPage = page;
      this.views.forEach((view) => view.onSetCurrentPage(page));
    }
  }

  clearCurrentPage() {
    if (this.currentPage) {
      this.clearCurrentKey();
      this.views.forEach((view) => view.onClearCurrentPage());
      this.currentPage = null;
    }
  }

  addCurrentKey(key) {
    if (this.currentKeys.indexOf(key) < 0) {
      this.currentKeys.push(key);
      this.views.forEach((view) => view.onAddCurrentKey(key));
    }
  }

  clearCurrentKey() {
    if (this.currentKeys.length > 0) {
      command.editTexts(this);
      this.views.forEach((view) => view.onClearCurrentKey());
      this.currentKeys = [];
    }
  }

  setCurrentKey(key) {
    this.clearCurrentKey();
    this.addCurrentKey(key);
  }

  findTextIndex(page, key) {
    if (page && page.texts) {
      return page.texts.findIndex(item => item.key === key)
    }
    return -1;
  }

  currentPageIndex() {
    return this.pages.indexOf(this.currentPage);
  }

  currentTextIndex() {
    const key = this.currentKeys[0];
    const page = this.currentPage;
    return this.findTextIndex(page, key);
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

    const width = shape.topx(this.canvasSize.width);
    const height = shape.topx(this.canvasSize.height);
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

  getPageByKey(key) {
    const query = '#p' + key;
    return this.pages.find(page => page.texts.querySelector(query));
  }

  getThumbnailSize(size) {
    const thumbnailWidth = thumbnailWidths[size || 'large'];
    const scale = thumbnailWidth / this.canvasSize.width;
    const width = Math.ceil(this.canvasSize.width * scale);
    const height = Math.ceil(this.canvasSize.height * scale);
    return { width: width, height: height };
  }

  async makeData() {
    const data = {};
    data.params = $.extend({}, this.params);
    data.pids = [];
    this.pages.forEach((page) => {
      data.pids.push(page.pid);
    });
    return data;
  }

  async save() {
    const data = await this.makeData();
    await file.writeJSON(this.url, data);

    console.warn(`[save ${this.url}]`);
  }
}

export { Project };
