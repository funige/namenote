import { View } from './view.js';

import { recentURL } from './recent-url.js';
import { menu } from './menu.js';
import { title } from './title.js';
import { config } from './config.js';
import { viewButton } from './view-button.js';
import { DrawingLayer } from './drawing-layer.js';

// $('.main-view')[0].parentNode.scrollTop = ...


class MainView extends View {
  constructor(element) {
    super(element);
    this.id = 'main';

    this.enableSmoothScroll(this.element); // this.content;
    this.init();
  }

  init() {
    this.drawingLayer = new DrawingLayer();
  }

  loadProject(project) {
    super.loadProject(project);
    if (!project) {
      title.set(null);
      return;
    }

    //　Init project
    recentURL.add(project.url);
    menu.update();
    viewButton.update();
    title.set(project.name());

    this.scale = 1;
    this.steps = this.getSteps();
    this.flip = false;

    this.pageData = {};
    this.initProject(project);

    this.onLoadProject(project);
  }

  initProject(project) {
    if (!config.getValue('multipage')) {
      $(this.element).html(`
        <div class='right-scroll-bar'></div>
        <div class='bottom-scroll-bar'></div>
        <div class='corner-box'></div>
        <div class='singlepage-content'></div>
        <canvas class='drawing-layer'></canvas>
      `);
      this.content = this.element.querySelector('.singlepage-content');
    } else {
      $(this.element).html(`
        <div class='multipage-content'></div>
        <canvas class='drawing-layer'></canvas>
      `);
      this.content = this.element.querySelector('.multipage-content');
    }
    this.drawingLayer.init(this.content);

    project.pages.forEach((page, index) => {
      const pid = page.pid;
      const pageElement = this.createPageElement(pid);
      this.content.appendChild(pageElement);

      this.pageData[pid] = {
        element: pageElement
      };
      if (page.loaded()) {
        this.initPage(page);
      }
      this.updatePage(pid, index);
    });
  }

  initPage(page) {
    const pd = this.pageData[page.pid];
    pd.frame = this.createFrame();
    pd.canvas = this.createCanvas(page);

    pd.texts = this.createTexts(page);
    pd.texts.childNodes.forEach((p) => {
    });

    pd.canvas.className = 'canvas';
    pd.texts.className = 'texts';

    pd.ctx = pd.canvas.getContext('2d');
    pd.ctx.filter = `blur(${this.getSteps()}px)`;
    pd.ctx.drawImage(page.canvas, 0, 0);

    pd.marks = this.project.draftMarks();

    pd.frame.appendChild(pd.marks);
    pd.frame.appendChild(pd.canvas);
    pd.frame.appendChild(pd.texts);
    pd.element.appendChild(pd.frame);
    $(pd.element).removeClass('preload');
  }

  // //////////////

  createPageElement(pid) {
    const element = document.createElement('div');
    element.className = 'page preload';
    element.id = 'page-' + pid;
    return element;
  }

  getPageRect(index) {
    const width = Math.round(this.project.canvasSize[0] * this.scale);
    const height = Math.round(this.project.canvasSize[1] * this.scale);
    const margin = 50;

    const x = index * (width + margin) + margin;
    const y = margin;
    return {
      x: x, y: y, width: width, height: height
    };
  }

  updateScale() {
    console.log(this.project, this.getSteps(), this.steps);
    const updateSteps = (this.steps != this.getSteps());
    this.steps = this.getSteps();

    this.project.pages.forEach((page, index) => {
      this.updatePage(page.pid, index, updateSteps);
    });
  }

  updatePage(pid, index, updateSteps) {
    const pd = this.pageData[pid];
    const rect = this.getPageRect(index);

    if (pd.element) {
      pd.element.style.width = rect.width + 'px';
      pd.element.style.height = rect.height + 'px';
      pd.element.style.left = rect.x + 'px';
      pd.element.style.top = rect.y + 'px';
    }
    if (pd.texts) pd.texts.style.transform = `scale(${this.scale})`;
    if (pd.canvas) pd.canvas.style.transform = `scale(${this.scale})`;
    if (pd.marks) pd.marks.style.transform = `scale(${this.scale})`;

    const page = this.project.pages[index];
    if (page && updateSteps) {
      pd.ctx.filter = `blur(${this.getSteps()}px)`;
      pd.ctx.clearRect(0, 0, pd.canvas.width, pd.canvas.height);
      pd.ctx.drawImage(page.canvas, 0, 0);
    }
  }

  getSteps() {
    return (1.0 / this.scale) >> 1;
  }


  /* flipView() {
    if (!this.project) return
    this.flip = ~this.flip
    this.element.style.transform = (this.flip) ? 'scale(-1, 1)' : ''
  } */

  zoom() {
    if (!this.project) return;
    this.scale /= 0.9;
    this.updateScale();
  }

  unzoom() {
    if (!this.project) return;
    this.scale *= 0.9;
    this.updateScale();
  }

  setMultipage(value) {
    if (config.updateValue('multipage', value)) {
      console.log('update multipage', config.getValue('multipage'));

      this.loadProject(this.project);
    }
  }

  setPrintPreview(value) {
    if (config.updateValue('printPreview', value)) {
      console.log('update printPreview', config.getValue('printPreview'));

      this.loadProject(this.project);
    }
  }

  initCurrentPage() {
    const pid = this.project.currentPage;
    this.onSetCurrentPage(pid);
  }

  initCurrentText() {
    this.project.currentTexts.forEach((tid) => {
      this.onAddCurrentText(tid);
    });
  }

  onSetCurrentPage(pid) {
    const pd = this.pageData[pid];
    if (pd && pd.element) {
      $(pd.element).addClass('selected');
    }
  }

  onClearCurrentPage() {
    const pid = this.project.currentPage;
    const pd = this.pageData[pid];
    if (pd && pd.element) {
      $(pd.element).removeClass('selected');
    }
  }

  onAddCurrentText(tid) {
    $('#p' + tid).addClass('selected');
  }

  onClearCurrentText() {
    this.project.currentTexts.forEach((tid) => {
      $('#p' + tid).removeClass('selected');
    });
  }

  onLoadProject(project) {
    const snapshot = this.snapshots[project.url] || {};
    this.content.scrollTop = snapshot.scrollTop || 0;
    this.content.scrollLeft = snapshot.scrollLeft || 0;
    this.scale = snapshot.scale || 1;
    this.updateScale();

    this.initCurrentPage();
    this.initCurrentText();
  }
  
  onUnloadProject(project) {
    const snapshot = {};
    snapshot.scale = this.scale;
    snapshot.scrollLeft = this.content.scrollLeft;
    snapshot.scrollTop = this.content.scrollTop;
    this.snapshots[project.url] = snapshot;
  }

  onresize() {
    this.drawingLayer.onresize();
  }
}

export { MainView };
