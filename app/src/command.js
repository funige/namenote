import { namenote } from './namenote.js';

import { divider } from './divider.js';
import { toolButton } from './tool-button.js';
import { dockTab } from './dock-tab.js';
import { projectManager } from './project-manager.js';
import { flash } from './flash.js';
import { file } from './file.js';

import { dialog } from './dialog.js';
import { history } from './history.js';
import { action } from './action.js';

import { AboutForm } from './about-form.js';
import { OpenForm } from './open-form.js';
import { TabletSettingsForm } from './tablet-settings-form.js';

const _runMain = (message, data) => {
  if (namenote.app) {
    LOG('runMain', message, data);
    namenote.app.runMain(message, data);
  } else {
    LOG(`${message}: can\`t execute this command on browser.`);
  }
};

// //////////////////////////////////////////////////////////////

class Command {
  constructor() {
  }

  undo() {
    LOG('undo');
  }

  redo() {
    LOG('redo');
  }

  about() {
    dialog.open(new AboutForm()).then(() => {
      dialog.close();
    });
  }

  pen(e) {
    LOG('pen');
    toolButton.select('pen');
  }

  eraser(e) {
    LOG('eraser');
    toolButton.select('eraser');
  }

  text(e) {
    LOG('text');
    toolButton.select('text');
  }

  dock() {
    LOG('dock');
    divider.toggle();
  }

  showTextView() {
    $(namenote.noteView.element).hide();
    $(namenote.pageView.element).hide();
    $(namenote.textView.element).show();
    dockTab.select('text');
  }

  showPageView() {
    $(namenote.noteView.element).hide();
    $(namenote.pageView.element).show();
    $(namenote.textView.element).hide();
    dockTab.select('page');
  }

  showNoteView() {
    $(namenote.noteView.element).show();
    $(namenote.pageView.element).hide();
    $(namenote.textView.element).hide();
    dockTab.select('note');
  }

  openNewDialog() {
    file.openNewDialog().catch((error) => {
      dialog.alert(error);
    });
  }

  openDialog() {
    file.openDialog().catch((error) => {
      dialog.alert(error);
    });
  }

  open(url) {
    file.open(url).catch((error) => {
      dialog.alert(error);
    });
  }

  exportCSNF() {
    file.exportCSNFDialog().catch((error) => {
      dialog.alert(error);
    });
  }

  exportPDF() {
    file.exportPDFDialog().catch((error) => {
      dialog.alert(error);
    });
  }

  savePageImage() {
    file.savePageImageDialog().catch((error) => {
      dialog.alert(error);
    });
  }

  /* close() {
    projectManager.close()
  } */

  flipView() {
    LOG('flipView');
    namenote.mainView.flipView();
  }

  zoom() {
    namenote.mainView.zoom();
  }

  unzoom() {
    namenote.mainView.unzoom();
  }

  toggleEditMode() {}

  tabletSettings() {
    dialog.open(new TabletSettingsForm()).then(() => {
      dialog.close();
    }).catch((error) => { dialog.alert(error); });
  }

  logout(scheme) {
    file.logout(scheme);
  }

/*
  movePage(sender, oldIndex, newIndex, oldURL, newURL) {
    const project = namenote.mainView.project
    if (!project) return

    if (!oldURL) oldURL = project.url
    if (!newURL) newURL = oldURL

    const item = ['movePage', oldIndex, newIndex, oldURL, newURL]
    history.pushUndo(item)
    action.play(item)

//  project.views.forEach((view) => {
//    if (view !== sender) {
//      view.update()
//    }
//  })
  }
*/
  
  dockSide(side) {
    divider.setPosition(side);
  }

  thumbnailSize(size) {
    namenote.setThumbnailSize(size);
  }

  // ////////////////

  do(item, data) {
    const arr = item.split('.');
    if (arr.length == 2) {
      item = arr[0];
      data = arr[1];
    }

    LOG('command.do', item, data);
    if (item && this[item]) {
      this[item](data);
    }
  }

  // ////////////////

  developerTools() {
    _runMain('developerTools');
  }

  fullScreen() {
    if (namenote.app) {
      _runMain('fullScreen');
    } else {
      document.documentElement.requestFullscreen();
    }
  }

  quit() {
    _runMain('quit');
  }

  reload() {
    location.reload();
  }
}

const command = new Command();

export { command };
