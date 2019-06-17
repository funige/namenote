import { command } from './command.js';
import { namenote } from './namenote.js';
import { config } from './config.js';

let quickZoomButton;
let zoomButton;
let unzoomButton;
let dockButton;


class ViewButton {
//  constructor() {
//  }

  static init() {
    quickZoomButton = $('#row-button').imageButton({
      src: 'img/magnifier-button.png',
      float: 'right',
      click: () => { command.quickZoom(); }
    })[0];

    zoomButton = $('#zoom-button').imageButton({
      src: 'img/zoom-button.png',
      disabled: true,
      float: 'right',
      click: () => { command.zoom(); }
    })[0];

    unzoomButton = $('#unzoom-button').imageButton({
      src: 'img/unzoom-button.png',
      disabled: true,
      float: 'right',
      click: () => { command.unzoom(); }
    })[0];

    dockButton = $('#dock-button').imageButton({
      src: 'img/unzoom-button.png',
      float: 'right',
      click: () => { command.dock(); }
    })[0];
  }

  static update() {
    const project = namenote.currentProject();
    const quickZoom = project; // (project) ? project.view.quickZoom : false

    $(zoomButton).imageButton('disabled', !project);
    $(unzoomButton).imageButton('disabled', !project);
    $(quickZoomButton).imageButton('disabled', !project);

    $(quickZoomButton).imageButton('locked', quickZoom);
    $(dockButton).imageButton('locked', config.data.sideBar);
  }
}

const viewButton = new ViewButton();

export { viewButton };
