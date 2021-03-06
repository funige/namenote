import { namenote } from './namenote.js';

import { divider } from './divider.js';
import { toolButton } from './tool-button.js';
import { dockTab } from './dock-tab.js';
import { projectManager } from './project-manager.js';
import { pageManager } from './page-manager.js';
import { toolManager } from './tool-manager.js';
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
    if (history.hasUndo()) {
      const record = history.popUndo();
      console.log('undo', record);
      history.pushRedo(record);
      action.rewind(record);
    }
  }

  redo() {
    if (history.hasRedo()) {
      const record = history.popRedo();
      console.log('redo', record)
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
    //console.log('text', namenote.textView.content.scrollHeight);
    //console.log('page', namenote.pageView.content.scrollHeight);
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
    file.downloadImageDialog().catch((error) => {
    //file.saveImageDialog().catch((error) => {
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

  toggleEditable() {
    const project = namenote.mainView.project;
    if (!project) return;

    // とりあえず
    if (project.currentKeys.length === 1) {
      const key = project.currentKeys[0];
      const element = namenote.mainView.keyElement(key);
      
      if (element === document.activeElement) {
        //namenote.mainView.removeEditable(element);
        const element2 = namenote.textView.keyElement(key);

        console.warn('element2', element2);
        if (element2) {
          element2.focus();
          setImmediate(() => {
            if (element === document.activeElement) {
              element.blur();
            }
          });

        } else {
          element.blur();
        }

      } else {
        namenote.mainView.addEditable(element);
        element.focus();
      }
    }
  }
  
  increaseFontSize() {
    const project = namenote.mainView.project;
    if (!project) return;
    project.currentKeys.forEach((key) => {
      const element = namenote.mainView.keyElement(key);
      if (element) {
        Text.increaseFontSize(element);
      }
    });
  }
  
  decreaseFontSize() {
    const project = namenote.mainView.project;
    if (!project) return;
    project.currentKeys.forEach((key) => {
      const element = namenote.mainView.keyElement(key);
      if (element) {
        Text.decreaseFontSize(element);
      }
    });
  }

  toggleDirection() {
    const project = namenote.mainView.project;
    if (!project) return;
    project.currentKeys.forEach((key) => {
      const element = namenote.mainView.keyElement(key);
      if (element) {
        Text.toggleDirection(element);
      }
    });
  }

  tabletSettings() {
    dialog.open(new TabletSettingsForm()).then(() => {
      dialog.close();
    }).catch((error) => { dialog.alert(error); });
  }

  logout(scheme) {
    file.logout(scheme);
  }

  // Basic actions

  moveNote(from, to) {
    console.log('moveNote');
    const project = projectManager.projects.splice(from, 1)[0];
    projectManager.projects.splice(to, 0, project);
    namenote.noteView.loadProjects(); //test
  }

  async addNote(to) {
    await this.openDialog();
    console.log('noteView append', to);
  }

  removeNote(from) {
    console.log('noteView trash', from);
    const project = projectManager.projects[from];
    projectManager.removeProject(project);
  }
  
  movePage(project, from, to) {
    const record = [];

    record.push(['movePage', from, to, project.url]);
    history.pushUndo(record);
    action.play(record);
  }

  moveText(project, from, to, fromPID, toPID) {
    const record = [];

    record.push(['moveText', from, to, fromPID, toPID, project.url]);
    history.pushUndo(record);
    action.play(record);
  }

  async addPage(project, to) {
    const index = (to >= 0) ? to : project.pages.length - 1;
    const record = [];

    const page = await pageManager.create(project);
    record.push(['addPage', page.pid, index + 1, project.url]);
    history.pushUndo(record);
    action.play(record);
  }

  removePage(project, from) {
    const index = (from >= 0) ? from : project.pages.length - 1;
    const record = [];

    const pid = project.pages[index].pid;
    record.push(['removePage', pid, index, project.url]);
    history.pushUndo(record);
    action.play(record);
  }

  addText(project, to, toPID, x, y, callback) {
    const record = [];

    const page = pageManager.find(project, toPID);
    const index = (to >= 0) ? to : page.texts.length - 1;
    const text = Text.createNext(page.texts[index], x, y, callback);

    record.push(['addText', text, index + 1, toPID, project.url]);
    history.pushUndo(record);
    action.play(record);
  }

  removeText(project, from, fromPID) {
    console.log('[removeText]', from, fromPID);
    const record = [];

    const page = pageManager.find(project, fromPID);
    if (!page || !page.texts) return;
    if (page.texts.length === 0) return;

    const index = (from >= 0) ? from : page.texts.length - 1;
    const text = page.texts[index];
    console.log(text);

    record.push(['removeText', text, index, fromPID, project.url]);
    history.pushUndo(record);
    action.play(record);
  }

  editText(project, key) {
    const element = document.getElementById('p' + key);
    if (element) {
      const index = project.findTextIndex(project.currentPage, key);
      if (index < 0) {
        console.error('???', index, key, document.getElementById('p' + key));
        return null;
      }
      
      const page = project.currentPage;
      const fromText = page.texts[index];
      const toText = Text.toText(element, 'p');

      if (!page) console.error('error?', page);
      if (!Text.shallowEqual(fromText, toText)) {
        //console.warn('changed', fromText, toText);

        if (!fromText) console.error('???' + fromText, project, key);
        return ['editText', fromText, toText, index, page.pid, project.url];
      }
    }
    return null;
  }

  editTexts(project) {
    const record = [];
    project.currentKeys.forEach((key) => {
      const item = this.editText(project, key);
      if (item) {
        record.push(item);
      }
    });

    if (record.length > 0) {
      history.pushUndo(record);
      action.play(record);
      console.log('editTexts...');
    } else {
      console.log('editTexts...', 'no text changed');
    }
  }

  editImage(project, toImage, rect, pid) {
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
  repaint() {
    console.log('repaint');
    namenote.loadProject(namenote.currentProject());
  }
}

const command = new Command();

export { command };
