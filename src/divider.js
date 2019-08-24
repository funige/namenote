import { config } from './config.js';
import { viewButton } from './view-button.js';
import { namenote } from './namenote.js';

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
    if (namenote.mainView) namenote.mainView.onresize();
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
    const saveIndicator = $('#save-indicator');

    if (value == 'left') {
      $('#left-component')
        .css('box-shadow', '0px 0px 8px 0px rgba(0,0,0,0.2)')
        .css('z-index', 1)
        .append(dock);
      $('#right-component')
        .css('box-shadow', 'none')
        .css('z-index', 0)
        .append(mainView)
        .append(saveIndicator);

    } else {
      $('#right-component')
        .css('box-shadow', '0px 0px 8px 0px rgba(0,0,0,0.2)')
        .css('z-index', 1)
        .append(dock);
      $('#left-component')
        .css('box-shadow', 'none')
        .css('z-index', 0)
        .append(mainView)
        .append(saveIndicator);
    }
    this.update();
  }

  onDividerDragEnd() {
    console.log('[divider drag end]');
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
