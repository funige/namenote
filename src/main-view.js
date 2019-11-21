import { View } from './view.js';

import { recentURL } from './recent-url.js';
import { menu } from './menu.js';
import { title } from './title.js';
import { config } from './config.js';
import { viewButton } from './view-button.js';
import { DrawingLayer } from './drawing-layer.js';
import { pageManager } from './page-manager.js';
import { ScrollBar } from './scroll-bar.js';
import { Rect } from './rect.js';
import { Text } from './text.js';

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
    this.pageData = {};
    if (!project) {
      title.set();
      this.element.innerHTML = '';
      return;
    }

    // Init project
    recentURL.add(project.url);
    menu.update();
    viewButton.update();
    title.set(project.name());

    this.scale = 1;
    this.steps = this.getSteps();
    this.flip = false;

    this.initProject(project);
    this.onLoadProject(project);
  }

  initProject(project) {
    if (!config.getValue('multipage')) {
      $(this.element).html(`
        <div class='right-scroll-bar'></div>
        <div class='bottom-scroll-bar'></div>
        <div class='corner-scroll-bar'></div>
        <div class='singlepage-content'></div>
        <canvas class='drawing-layer'></canvas>
        `);
      this.content = this.element.querySelector('.singlepage-content');
      this.rightScrollBar = new ScrollBar(this.content, 'right');
      this.bottomScrollBar = new ScrollBar(this.content, 'bottom');
    } else {
      $(this.element).html(`
        <div class='multipage-content'></div>
        <canvas class='drawing-layer'></canvas>
      `);
      this.content = this.element.querySelector('.multipage-content');
      this.rightScrollBar = null;
      this.bottomScrollBar = null;
    }

    this.drawingLayer.init(this.content);

    project.pages.forEach((page, index) => {
      this.initPageData(page, index);
      if (page.loaded) {
        this.initPage(page);
      }
    });
    this.setAnchor();
  }

  initPage(page) {
    const pd = this.pageData[page.pid];
    pd.frame = this.createFrame();
    pd.canvas = this.createCanvas(page);

    pd.texts = this.createTexts(page);
    pd.texts.childNodes.forEach((p) => {
      $(p)
        .on('input', (e) => {
          this.onInput(e);
        })
        .on('blur', (e) => {
          this.removeEditable(p);
        });
      
      setImmediate(() => {
        Text.initPosition(p);
      }) 
    });

    pd.canvas.className = 'canvas';
    pd.texts.className = 'texts';
    pd.ctx = pd.canvas.getContext('2d');

    pd.marks = this.project.draftMarks();

    pd.frame.appendChild(pd.marks);
    pd.frame.appendChild(pd.canvas);
    pd.frame.appendChild(pd.texts);
    pd.element.appendChild(pd.frame);
    $(pd.element).removeClass('preload');

    this.updateImage(page.pid);
  }


  initPageData(page, index) {
    super.initPageData(page, index);
    this.updatePageRect(page.pid, index);
  }

  createPageElement(pid, index) {
    const element = document.createElement('div');
    element.className = 'page preload';
    element.id = 'page-' + pid;
    return element;
  }

  keyElement(key) {
    return document.getElementById('p' + key);
  }
  
  keyRect(key) {
    return Rect.get(this.keyElement(key));
  }

  projectRect() {
    const rect = this.pageRectFor(this.project.pages.length - 1);
    const margin = 50;
    return {
      x: rect.x + rect.width + margin,
      y: rect.y + rect.height + margin,
    };
  }
  
  pageRectFor(index) {
    const width = Math.round(this.project.canvasSize.width * this.scale);
    const height = Math.round(this.project.canvasSize.height * this.scale);
    const margin = 50;

    const x = index * (width + margin) + margin;
    const y = margin;
    return {
      x: x, y: y, width: width, height: height
    };
  }

  onScale() {
    const updateImageNeeded = (this.steps !== this.getSteps());
    this.steps = this.getSteps();

    this.project.pages.forEach((page, index) => {
      this.updatePageRect(page.pid, index);
      if (updateImageNeeded) {
        this.updateImage(page.pid);
      }
    });
    this.setAnchor();
  }

  updatePageRect(pid, index) {
    const pd = this.pageData[pid];
    const rect = this.pageRectFor(index);

    if (pd.element) {
      pd.element.style.width = rect.width + 'px';
      pd.element.style.height = rect.height + 'px';
      pd.element.style.left = rect.x + 'px';
      pd.element.style.top = rect.y + 'px';
    }
    if (pd.texts) pd.texts.style.transform = `scale(${this.scale})`;
    if (pd.canvas) pd.canvas.style.transform = `scale(${this.scale})`;
    if (pd.marks) pd.marks.style.transform = `scale(${this.scale})`;
  }

  setAnchor() {
    if (!this.anchor) {
      this.anchor = document.createElement('div');
      this.anchor.className = 'anchor';
      this.content.appendChild(this.anchor);
    }

    const rect = this.projectRect();
    this.anchor.style.left = rect.x + 'px';
    this.anchor.style.top = rect.y + 'px';
  }

  updateImage(pid) {
    const page = pageManager.find(this.project, pid);
    if (page && page.loaded) {
      const pd = this.pageData[pid];
      pd.ctx.filter = `blur(${this.getSteps()}px)`;
      pd.ctx.clearRect(0, 0, pd.canvas.width, pd.canvas.height);
      pd.ctx.drawImage(page.canvas, 0, 0);
    }
  }

  onInput(e) {
    const key = parseInt(e.target.id.replace(/^p/, ''));
    const element = document.getElementById('t' + key);
    if (element) {
      element.innerHTML = e.target.innerHTML;
    }
  }
  
  onEditImage(toImage, rect, pid) {
    this.updateImage(pid);

    /* const page = pageManager.find(this.project, pid);
    const pd = this.pageData[pid];
    const blur = this.getSteps();
    rect.x -= blur;
    rect.y -= blur;
    rect.width += blur * 2;
    rect.height += blur * 2;

    pd.ctx.filter = `blur(${this.getSteps()}px)`;
    pd.ctx.clearRect(rect.x, rect.y, rect.width, rect.height);
    pd.ctx.drawImage(page.canvas,
                     rect.x, rect.y, rect.width, rect.height,
                     rect.x, rect.y, rect.width, rect.height); */
  }

  getSteps() {
    return (1.0 / this.scale) >> 1; // eslint-disable-line no-bitwise
  }

  /* flipView() {
     if (!this.project) return
     this.flip = ~this.flip
     this.element.style.transform = (this.flip) ? 'scale(-1, 1)' : ''
     } */

  zoom() {
    if (!this.project) return;
    this.scale /= 0.9;
    this.onScale();
  }

  unzoom() {
    if (!this.project) return;
    this.scale *= 0.9;
    this.onScale();
  }

  setMultipage(value) {
    if (config.updateValue('multipage', value)) {
      console.log('update multipage', config.getValue('multipage'));
      this.loadProject(this.project);

      setTimeout(() => {
        this.onresize();
      }, 100);
    }
  }

  setPrintPreview(value) {
    if (config.updateValue('printPreview', value)) {
      console.log('update printPreview', config.getValue('printPreview'));

      this.loadProject(this.project);
    }
  }

  initCurrentPage() {
    const page = this.project.currentPage;
    this.onSetCurrentPage(page);
  }

  initCurrentKeys() {
    this.project.currentKeys.forEach((key) => {
      this.onAddCurrentKey(key);
    });
  }
  
  onAddCurrentKey(key) {
    this.addSelected(this.keyElement(key));
  }

  onClearCurrentKey() {
    this.project.currentKeys.forEach((key) => {
      const element = this.keyElement(key);
      console.log('onClearCurrentKey', key, element)
      this.removeSelected(element);
      this.removeEditable(element);
    });
  }

  onLoadProject(project) {
    const snapshot = this.snapshots[project.url] || {};
    this.content.scrollTop = snapshot.scrollTop || 0;
    this.content.scrollLeft = snapshot.scrollLeft || 0;
    this.scale = snapshot.scale || 1;
    this.onScale();
    this.onresize();

    this.initCurrentPage();
    this.initCurrentKeys();
  }

  onUnloadProject(project) {
    this.snapshots[project.url] = {
      scale: this.scale,
      scrollLeft: this.content.scrollLeft,
      scrollTop: this.content.scrollTop
    };
  }

  onresize() {
    if (this.content) {
      this.offsetWidth = this.content.offsetWidth;
      this.offsetHeight = this.content.offsetHeight;
      this.scrollLeft = this.content.scrollLeft;
      this.scrollTop = this.content.scrollTop;
      this.scrollWidth = this.content.scrollWidth;
      this.scrollHeight = this.content.scrollHeight;
      console.log('resize',
        this.offsetWidth, this.offsetHeight, '-',
        this.scrollLeft, this.scrollTop, '-',
        this.scrollWidth, this.scrollHeight);
    }
    if (this.rightScrollBar) this.rightScrollBar.onresize();
    if (this.bottomScrollBar) this.bottomScrollBar.onresize();

    this.drawingLayer.onresize();
  }


  addSelected(element) {
    if (element && !element.classList.contains('selected')) {
      element.classList.add('selected');
    }
  }

  removeSelected(element) {
    if (element && element.classList.contains('selected')) {
      element.classList.remove('selected');
    }
  }

  toggleEditable(element) {
    if (element && !element.classList.contains('editable')) {
      this.addEditable(element);
    } else {
      this.removeEditable(element);
    }
  }
  
  addEditable(element) {
    if (element && !element.classList.contains('editable')) {
      element.classList.add('editable');
      element.contentEditable = true;
    }
  }

  removeEditable(element) {
    if (element && element.classList.contains('editable')) {
      element.classList.remove('editable');
      element.contentEditable = false;
    }
  }
  
}

export { MainView };
