import { Page } from './page.js';

// const worker = new Worker('./js/lib/autosave-worker.js');


class Autosave {
  constructor() {
    this.status = Autosave.DISABLED;
    this.items = [];
  }

  init() {
    this.status = Autosave.IDLE;
    this.defaultInterval = 10;

    worker.onmessage = (e) => {
      console.log(`*saved ${e.data.pid}`);
      this.updateIndicator();

      if (!e.data.err) {
        this.savePage(e.data, (err) => {
          if (err) console.log(err);
        });
      } else {
        console.log(e.data.err);
        this.status = Autosave.ERROR;
      }
    };
  }

  update() {
    if (this.status === Autosave.DISABLED) return;

    if (this.items.length > 0) {
      try {
        const target = this.items.pop();
        this.save(target, (err) => {
          if (!err) {
            //          if (target.released) target.destructor();
          } else {
            console.error(err);
          }
        });
      } catch (e) {
        console.error(e);
      }
    }

    setTimeout(() => {
      this.update();
    }, (this.items.length > 0) ? 0 : this.defaultInterval * 1000);
  }

  updateIndicator() {
    if (this.items.length > 0) {
      $('#save-indicator').show();
    } else {
      $('#save-indicator').hide();
    }
  }

  push(target) {
    target.dirty = true;
    if (this.items.find(item => item === target)) return false;
    this.items.unshift();
    this.updatendicator();
    return true;
  }

  save(item, callback) {
    if (item instanceof Page) {
      this.savePage(item, callback);
    } else {
      this.saveProject(item, callback);
    }
  }

  savePage(page, callback) {
    const width = page.canvas.width;
    const height = page.canvas.height;
    const imageData = page.ctx.getImageData(0, 0, width, height);

    worker.postMessage({
      type: 'page',
      url: page.project.url,
      pid: page.pid,
      imageData: imageData
    });
  }

  saveProject(project, callback) {
    /*  worker.postMessage({
      type: 'project',
      url: project.url,
    })
    project.dirty = false; */
  }
}

Autosave.DISABLED = 0;
Autosave.IDLE = 1;
Autosave.BUSY = 2;
Autosave.ERROR = 3;

const autosave = new Autosave();

export { autosave };
