import { divider } from './divider.js';
import { dialog } from './dialog.js';
import { menu } from './menu.js';
import { title } from './title.js';

import { header } from './header.js';
import { dock } from './dock.js';


class UI {
  constructor() {
    this.menu = menu;
    this.divider = divider;
    this.dialog = dialog;

    this.header = header;
    this.dock = dock;
  }

  init() {
    menu.init();
    title.init();
    divider.init();
    dialog.init();

    header.init();
    dock.init();

    $('.split-pane').css('opacity', 1);
  }

  update() {
    WARN('[ui update]');
    divider.update();

    //  header.update()
    //  dock.update()
  }
}

const ui = new UI();

export { ui };
