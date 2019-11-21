import { namenote } from './namenote.js';
import { projectManager } from './project-manager.js';
import { pageManager } from './page-manager.js';
import { toolManager } from './tool-manager.js';

const MIN_MOVE = 5;

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

const api = ('ontouchend' in document) ? API.TOUCH : API.MOUSE;

let pointerId;
let stroke;
//let moved;
//let x0;
//let y0;
//let x;
//let y;
//let pressure;
let numTouches;

class Pointer {
  constructor() {
    this.spaceKey = false;
    this.altKey = false;
    this.ctrlKey = false;
    this.metaKey = false;
    this.shiftKey = false;
  }

  init() {
    window[api.down] = (e) => {
      //if (e.touches && e.touches[0].length > 1 && !moved) {
      //  if (numTouches < e.touches.length) numTouches = e.touches.length;
      //} else {
      //  this.initStroke(e);
      //  this.downHandler(e);
      //}
      this.initStroke(e);
      this.downHandler(e);
    };

    window[api.up] = (e) => {
      if (e.pointerId && e.pointerId !== pointerId) return;
      this.upHandler(e);
      if (stroke) {
        console.log(stroke.length, 'points'); //flat());
        stroke = null;
      }
    };

    window[api.move] = (e) => {
      if (e.pointerId && e.pointerId !== pointerId) return;
      if (stroke) this.updateStroke(e);
      this.moveHandler(e);
    };

    document.addEventListener('keydown', (e) => {
      this.altKey = e.altKey;
      this.ctrlKey = e.ctrlKey;
      this.metaKey = e.metaKey;
      this.shiftKey = e.shiftKey;
      if (e.keyCode == 32) this.spaceKey = true;
    });

    document.addEventListener('keyup', (e) => {
      this.altKey = e.altKey;
      this.ctrlKey = e.ctrlKey;
      this.metaKey = e.metaKey;
      this.shiftKey = e.shiftKey;
      if (e.keyCode == 32) this.spaceKey = false;
    });

    document.addEventListener('cut', (e) => { console.log('cut'); });
    document.addEventListener('copy', (e) => { console.log('copy'); });
    document.addEventListener('paste', (e) => { console.log('paste'); });
  }

  selectPage(info) {
    if (info.projectURL && info.pid) {
      const project = projectManager.find(info.projectURL);
      if (project) {
        project.setCurrentPage(pageManager.find(project, info.pid));
      }
    }
  }

  downHandler(e) {
    const info = this.getTargetInfo(e.target);
    this.info = info;
    
    if (info.view) {
      const project = projectManager.find(info.projectURL);
      if (project) {
        if (info.pid) {
          project.setCurrentPage(pageManager.find(project, info.pid));
        }

        this.selectPage(info);

        if (info.view === 'main' && info.key) {
          project.addCurrentKey(info.key);
          
          if (e.target.contentEditable === 'true') return;
          toolManager.push('textMove');

        } else if (this.spaceKey) {
          toolManager.push('hand');

        } else if (this.ctrlKey) {
          toolManager.push('text');

        } else if (info.view === 'main' && !info.key) {
          if (project.currentKeys.length > 0) {
            console.error('clear current key...');
            project.clearCurrentKey();
            return;
          }
        }

        toolManager.currentTool().onDown(this.x, this.y);
      }
    }
  }

  upHandler(e) {
    if (stroke) {
      //if (!moved) {
      //  console.log('click', numTouches);
      //}

      //console.log('onup', toolManager.currentTool().name);
      toolManager.currentTool().onUp(stroke);
    }
  }

  moveHandler(e) {
    if (stroke) {
      //console.log('onmove', toolManager.currentTool().name);
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
          info.key = parseInt(result[1]);

          console.warn('contentEditable=', target.contentEditable);
          if (target.contentEditable === true) {
            info.editable = true;
          }
        }

        if (target.classList.contains('slider')) {
          info.slider = true;
          break;
        }
        if (target.classList.contains('scroll-bar')) {
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

    if (info.view || info.scrollBar) {
      const array = [];
      if (this.ctrlKey) array.push('CTRL');
      if (this.metaKey) array.push('META');
      if (this.altKey) array.push('ALT');
      if (this.shiftKey) array.push('SHIFT');
      if (this.spaceKey) array.push('SPACE');
      //console.log('getTargetInfo', info, array.join(' '));
    }
    return info;
  }

  isMoved() {
    return this.moved;
  }

  clearMove() {
    if (!this.spaceKey) {
      this.moved = false;
    }
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

  initStroke(e) {
    stroke = [];
    this.updateStroke(e)

    this.x0 = this.x;
    this.y0 = this.y;
    this.moved = false;
    numTouches = 1;
  }
  
  updateStroke(e) {
    this.x = (e.clientX !== undefined) ? e.clientX : e.touches[0].clientX;
    this.y = (e.clientY !== undefined) ? e.clientY : e.touches[0].clientY;
    this.pressure = e.pressure;
    stroke.push([this.x, this.y, this.pressure]);

    if (Math.abs(this.x - this.x0) >= MIN_MOVE ||
        Math.abs(this.y - this.y0) >= MIN_MOVE) {
      this.moved = true;
      //console.log('moved');
    }
  }
}

const pointer = new Pointer();

export { pointer };
