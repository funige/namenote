import { namenote } from './namenote.js';

import { divider } from './divider.js';
import { toolButton } from './tool-button.js';
import { dockTab } from './dock-tab.js';
import { projectManager } from './project-manager.js';
import { pageManager } from './page-manager.js';
import { toolManager } from './tool-manager.js';
import { flash } from './flash.js';
import { file } from './file.js';

import { dialog } from './dialog.js';
import { history } from './history.js';
import { action } from './action.js';

import { Page } from './page.js';
import { Text } from './text.js';
import { config } from './config.js';

import { AboutForm } from './about-form.js';
import { OpenForm } from './open-form.js';
import { TabletSettingsForm } from './tablet-settings-form.js';

const _runMain = (message, data) => {
  if (namenote.app) {
    console.log('runMain', message, data);
    namenote.app.runMain(message, data);
  } else {
    console.log(`${message}: can\`t execute this command on browser.`);
  }
};

//

class Command {
  constructor() {
  }

  undo() {
    console.log('undo');
    if (history.hasUndo()) {
      const record = history.popUndo();
      history.pushRedo(record);
      action.rewind(record);
    }
  }

  redo() {
    console.log('redo');
    if (history.hasRedo()) {
      const record = history.popRedo();
      history.pushUndo(record, true);
      action.play(record);
    }
  }

  about() {
    dialog.open(new AboutForm()).then(() => {
      dialog.close();
    });
  }

  pen(e) {
    toolButton.select('pen');
  }

  eraser(e) {
    toolButton.select('eraser');
  }

  text(e) {
    toolButton.select('text');
  }

  dock() {
    console.log('dock');
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

  saveImage() {
    file.saveImageDialog().catch((error) => {
      dialog.alert(error);
    });
  }

  flipView() {
    console.log('flipView');
    namenote.mainView.flipView();
  }

  zoom() {
    namenote.mainView.zoom();
  }

  unzoom() {
    namenote.mainView.unzoom();
  }

  toggleMultipage() {
    const value = config.getValue('multipage');
    namenote.mainView.setMultipage(!value);
  }

  togglePrintPreview() {
    const value = config.getValue('printPreview');
    namenote.mainView.setPrintPreview(!value);
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

  // Basic actions

  movePage(sender, from, to) {
    const project = sender.project;
    const record = [];

    record.push(['movePage', from, to, project.url]);
    history.pushUndo(record);
    action.play(record);
  }

  moveText(sender, from, to, fromPID, toPID) {
    const project = sender.project;
    const record = [];

    record.push(['moveText', from, to, fromPID, toPID, project.url]);
    history.pushUndo(record);
    action.play(record);
  }

  async addPage(sender, to) {
    const project = sender.project;
    const index = (to >= 0) ? to : project.pages.length - 1;
    const record = [];

    const page = await pageManager.create(project);
    record.push(['addPage', page.pid, index + 1, project.url]);
    history.pushUndo(record);
    action.play(record);
  }

  removePage(sender, from) {
    const project = sender.project;
    const index = (from >= 0) ? from : project.pages.length - 1;
    const record = [];

    const pid = project.pages[index].pid;
    record.push(['removePage', pid, index, project.url]);
    history.pushUndo(record);
    action.play(record);
  }

  addText(sender, to, toPID) {
    const project = sender.project;
    const record = [];

    const page = pageManager.find(project, toPID);
    const index = (to >= 0) ? to : page.texts.childNodes.length - 1;
    const text = Text.createNext(page.texts.childNodes[index]);
    console.log(text);

    record.push(['addText', text, index + 1, toPID, project.url]);
    history.pushUndo(record);
    action.play(record);
  }

  removeText(sender, from, fromPID) {
    const project = sender.project;
    const record = [];

    const page = pageManager.find(project, fromPID);
    const index = (from >= 0) ? from : page.texts.childNodes.length - 1;
    const text = page.texts.childNodes[index].outerHTML;
    console.log(text);

    record.push(['removeText', text, index, fromPID, project.url]);
    history.pushUndo(record);
    action.play(record);
  }

  editText(sender, toText, index, pid) {
    const project = sender.project;
    const record = [];

    const page = pageManager.find(project, pid);
    const fromText = page.texts.childNodes[index].outerHTML;

    record.push(['editText', fromText, toText, index, pid, project.url]);
    history.pushUndo(record);
    action.play(record);
  }

  editImage(sender, toImage, rect, pid) {
    const project = sender.project;
    const record = [];

    const page = pageManager.find(project, pid);
    const fromImage = page.getImage(rect);

    record.push(['editImage', fromImage, toImage, rect, pid, project.url]);
    history.pushUndo(record);
    action.play(record);
  }

  dockSide(side) {
    divider.setPosition(side);
  }

  thumbnailSize(size) {
    namenote.setThumbnailSize(size);
  }

  //

  do(item, data) {
    const arr = item.split('.');
    if (arr.length == 2) {
      item = arr[0];
      data = arr[1];
    }

    console.log('command.do', item, data);
    if (item && this[item]) {
      this[item](data);
    }
  }

  //

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
