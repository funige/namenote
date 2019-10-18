import { Page } from './page.js';


class Autosave {
  constructor() {
    this.status = Autosave.DISABLED;
    this.items = [];
  }

  init() {
    $('#save-indicator').on('click', () => {
      console.log('save indicator click');
      if (this.status === Autosave.ERROR) {
        $('#save-indicator').html('<img src="img/save-indicator.png" />');
        this.status = Autosave.IDLE;
        this.update();
      }
    });

    this.defaultInterval = 10;

    this.status = Autosave.IDLE;
    this.update(); // start autosave
  }

  async update() {
    if (this.status !== Autosave.IDLE) return;

    if (this.items.length > 0) {
      // const target = this.items.pop();
      const target = this.items[this.items.length - 1];

      try {
        await this.save(target);
        this.items.pop();
      } catch (e) {
        console.error('[autosave error]', e);
        this.status = Autosave.ERROR;
      }
    }

    this.updateIndicator();

    if (this.status === Autosave.IDLE) {
      setTimeout(() => {
        this.update();
      }, (this.items.length > 0) ? 0 : this.defaultInterval * 1000);
    }
  }

  updateIndicator() {
    if (this.status === Autosave.IDLE) {
      if (this.items.length > 0) {
        $('#save-indicator').show();
      } else {
        $('#save-indicator').hide();
      }
    } else {
      $('#save-indicator').html('<img src="img/save-indicator-red.png" />');
      $('#save-indicator').show();
    }
  }

  push(target) {
    if (!target) {
      console.error('autosave.push target === null');
      return;
    }

    target.dirty = true;
    if (this.items.find(item => item === target)) return false;
    this.items.unshift(target);
    this.updateIndicator();
    return true;
  }

  async save(item, callback) {
    if (item instanceof Page) {
      await this.savePage(item);
    } else {
      await this.saveProject(item);
    }
  }

  async savePage(page) {
    await page.save();
    page.dirty = false;
  }

  async saveProject(project) {
    await project.save();
    project.dirty = false;
  }
}

Autosave.DISABLED = 0;
Autosave.IDLE = 1;
Autosave.ERROR = 3;

const autosave = new Autosave();

export { autosave };
