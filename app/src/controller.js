import { namenote } from './namenote.js';

const MIN_MOVE = 5;

let moved = false;
let stroke = false;


class Controller {
  constructor() {
    this.api = 'pointer';

    this.spaceKey = false;
    this.altKey = false;
    this.ctrlKey = false;
    this.shiftKey = false;
  }

  updatePointer(e) {
    this.x = (e.clientX !== undefined) ? e.clientX : e.touches[0].clientX;
    this.y = (e.clientY !== undefined) ? e.clientY : e.touches[0].clientY;
    this.pressure = e.pressure;

    if (stroke) {
      LOG(this.x, this.y, this.pressure);
    }
  }

  init() {
    window.addEventListener(this.api + 'down', (e) => {
      this.updatePointer(e);
      this.pointerId = e.pointerId;

      this.x0 = this.x;
      this.y0 = this.y;
      this.onDown(e);
    });

    window.addEventListener(this.api + 'up', (e) => {
      this.onUp(e);
    });

    window.addEventListener(this.api + 'move', (e) => {
      if (this.pointerId != e.pointerId) return;

      this.updatePointer(e);
      if (Math.abs(this.x - this.x0) >= MIN_MOVE
          || Math.abs(this.y - this.y0) >= MIN_MOVE) {
        moved = true;
      }
      this.onMove(e);
    });

    document.addEventListener('keydown', (e) => {
      this.altKey = e.altKey;
      this.ctrlKey = e.ctrltKey;
      this.shiftKey = e.shiftKey;
      if (e.keyCode == 32) this.spaceKey = true;
    });

    document.addEventListener('keyup', (e) => {
      this.altKey = e.altKey;
      this.ctrlKey = e.ctrltKey;
      this.shiftKey = e.shiftKey;
      if (e.keyCode == 32) this.spaceKey = false;
    });

    document.addEventListener('cut', (e) => { ERROR('cut'); });
    document.addEventListener('copy', (e) => { ERROR('copy'); });
    document.addEventListener('paste', (e) => { ERROR('paste'); });
  }

  onDown(e) {
    const info = this.getTargetInfo(e);
    LOG('[onDown]', info);

    if (info.pid) {
      if (info.mainView || info.pageView || info.textView) {
        const project = namenote.mainView.project;
        project.setCurrentPage(info.pid);
      }
    }
  }

  onUp(e) {
  }

  onMove(e) {
  }


  getTargetInfo(e) {
    const info = {};
    info.parents = [];

    let target = e.target;
    while (target) {
      info.parents.push([target.className, target]);
      if (target.className === 'text') {
        info.text = true;
      }
      if (target.className === 'page'
          || target.className === 'pageview-page'
          || target.className === 'textview-page') {
        info.pid = this.detectPID(target);
      }

      if (target.className === 'main-view') { info.mainView = true; break; }
      if (target.className === 'page-view') { info.pageView = true; break; }
      if (target.className === 'text-view') { info.textView = true; break; }
      target = target.parentNode;
    }
    return info;
  }

  detectPID(element) {
    return parseInt(element.id.replace(/^(pageview-|textview-)?page-/, ''));
  }

  isMoved() {
    return moved;
  }

  clearMove() {
    if (!this.spaceKey) moved = false;
  }

  isEditable(e) {
    if (e) {
      if (e.tagName == 'INPUT'
          || e.tagName == 'SELECT'
          || e.tagName == 'TEXTAREA'
          || (e.contentEditable && e.contentEditable == 'true')) {
        return true;
      }
    }
    return false;
  }
}

const controller = new Controller();

export { controller };
