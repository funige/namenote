import { namenote } from './namenote.js';
import { projectManager } from './project-manager.js';
import { toolManager } from './tool-manager.js';

const MIN_MOVE = 5;

let moved = false;
let stroke = null;

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

    document.addEventListener('cut', (e) => { console.log('cut'); });
    document.addEventListener('copy', (e) => { console.log('copy'); });
    document.addEventListener('paste', (e) => { console.log('paste'); });
  }

  onDown(e) {
    const info = this.getTargetInfo(e.target);
    console.log('[onDown]', info);

    if (info.pid) {
      if (info.view) {
        const project = projectManager.find(info.projectURL);
        if (project) {
          project.setCurrentPage(project.pages.find(page => page.pid === info.pid));
        }
      }
    }

    if (info.view === 'main' && !info.text) {
      stroke = [[this.x, this.y]];
      toolManager.currentTool().onDown(this.x, this.y);
    }
  }

  onUp(e) {
    if (stroke) {
      toolManager.currentTool().onUp(stroke);
      stroke = null;
    }
  }

  onMove(e) {
    if (stroke) {
      stroke.push([this.x, this.y]);
      toolManager.currentTool().onMove(this.x, this.y);
    }
  }

  getTargetInfo(target) {
    const info = { parents: [] };
    while (target) {
      info.parents.push([target.className, target]);
      if (target.className === 'text') {
        info.text = true;
      }
      if (target.className && target.classList.contains('page')) {
        info.pid = namenote.mainView.detectPID(target);
      }

      if (target.className === 'main-view'
          || target.className === 'page-view'
          || target.className === 'text-view') {
        info.view = target.className.replace(/-view$/, '');
        info.projectURL = target.alt;
        break;
      }
      target = target.parentNode;
    }

    // if (info.view) console.log('getTargetInfo', info);
    return info;
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
