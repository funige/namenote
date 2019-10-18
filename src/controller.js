import { namenote } from './namenote.js';
import { projectManager } from './project-manager.js';
import { pageManager } from './page-manager.js';
import { toolManager } from './tool-manager.js';

const MIN_MOVE = 5;

let moved = false;
let stroke = null;

const API = {
  POINTER: {
    type: 'pointer',
    down: 'onpointerdown',
    move: 'onpointermove',
    up: 'onpointerup'
  },
  TOUCH: {
    type: 'touch',
    down: 'ontouchstart',
    move: 'ontouchmove',
    up: 'ontouchend'
  },
  MOUSE: {
    type: 'mouse',
    down: 'onmousedown',
    move: 'onmousemove',
    up: 'onmouseup'
  }
};

class Controller {
  constructor() {
    if (window.PointerEvent) {
      this.api = API.POINTER;
    } else {
      this.api = (window.TouchEvent) ? API.TOUCH : API_MOUSE;
    }

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
    window[this.api.down] = (e) => {
      console.log(this.api.type, 'down',
        e.pointerType,
        e.touches ? e.touches.length : '-');

      this.updatePointer(e);
      this.pointerId = e.pointerId;

      this.x0 = this.x;
      this.y0 = this.y;
      this.onDown(e);
    };

    window[this.api.up] = (e) => {
      console.log(this.api.type, 'up');
      this.onUp(e);
    };

    window[this.api.move] = (e) => {
      if (this.pointerId != e.pointerId) return;

      console.log(this.api.type, 'move');
      this.updatePointer(e);
      if (Math.abs(this.x - this.x0) >= MIN_MOVE
          || Math.abs(this.y - this.y0) >= MIN_MOVE) {
        moved = true;
      }
      this.onMove(e);
    };

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

    if (info.view) {
      const project = projectManager.find(info.projectURL);
      if (project) {
        if (info.pid) {
          project.setCurrentPage(pageManager.find(project, info.pid));
        }

        if (info.view === 'note') {
          namenote.loadProject(project);
        }

        if (info.view === 'main') {
          if (!info.tid) {
            project.clearCurrentTID();
            stroke = [[this.x, this.y]];
            toolManager.currentTool().onDown(this.x, this.y);
          } else {
            project.addCurrentTID(info.tid);
          }
        }
      }
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

      if (target.className) {
        if (target.classList.contains('page')) {
          info.pid = namenote.mainView.detectPID(target);
        }
        if (target.classList.contains('project')) {
          info.projectURL = target.alt;
        }
        if (target.classList.contains('text')) {
          const result = target.id.match(/^p(\d+)$/);
          info.tid = parseInt(result[1]);
        }

        if (target.className.indexOf('slider') >= 0) {
          info.slider = true;
        }
        if (target.className.indexOf('scroll-bar') >= 0) {
          info.scrollBar = true;
          break;
        }

        if (target.className === 'main-view'
            || target.className === 'page-view'
            || target.className === 'text-view'
            || target.className === 'note-view') {
          info.view = target.className.replace(/-view$/, '');
          info.projectURL = info.projectURL || target.alt;
          break;
        }
      }
      target = target.parentNode;
    }

    if (info.view || info.scrollBar) console.log('getTargetInfo', info);
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
