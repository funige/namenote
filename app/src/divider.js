import { config } from './config.js';
import { viewButton } from './view-button.js';

let minWidth = 250;

// //////////////////////////////////////////////////////////////

class Divider {
  constructor() {
  }

  init() {
    $('.split-pane').splitPane();
    $('.split-pane').on('dividerdragend', (e) => { // or 'splitpaneresize'
      this.onDividerDragEnd();
    });
    this.setPosition();
  }

  update(value) {
    LOG('[update]', value);

    if (value === undefined) value = config.data.sideBar;
    config.data.sideBar = value;
    config.save();

    let width = (value) ? config.data.sideBarWidth : 0;
    if (config.data.sideBarPosition == 'right') {
      width = $('.split-pane').width() - width + 1;
    }

    if (value) {
      const maxWidth = $('.split-pane').width() - minWidth - 1;
      if (width < minWidth) width = minWidth;
      if (width > maxWidth) width = maxWidth;
    }

    $('.split-pane').splitPane('firstComponentSize', width);
    viewButton.update();
  }

  toggle() {
    this.update(!config.data.sideBar);
  }

  setPosition(value) {
    if (value && value == config.data.sideBarPosition) return;
    if (!value) value = config.data.sideBarPosition || 'right';
    config.data.sideBarPosition = value;
    config.save();

    const mainView = $('.main-view');
    const dock = $('.sidebar');

    if (value == 'left') {
      $('#left-component').append(dock);
      $('#right-component').append(mainView);
    } else {
      $('#right-component').append(dock);
      $('#left-component').append(mainView);
    }
    this.update();
  }

  onDividerDragEnd() {
    LOG('[divider drag end]');
    let width = $('.sidebar').width();

    const maxWidth = $('.split-pane').width() - minWidth - 1;
    if (width < minWidth) width = minWidth;
    if (width > maxWidth) width = maxWidth;

    config.data.sideBarWidth = parseInt(width);
    config.data.sideBar = true;
    config.save();
    this.update();
  }
}

const divider = new Divider();

export { divider };
