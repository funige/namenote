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

import { Page } from './page.js';

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
    if (history.hasUndo()) {
      const record = history.popUndo();
      history.pushRedo(record)
      action.rewind(record);
    }
  }

  redo() {
    LOG('redo');
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

  // Basic actions
  
  movePage(sender, from, to) {
    LOG(`${from}=>${to}`);
    const project = sender.project;

    const record = []
    record.push(['movePage', from, to, project.url])
    history.pushUndo(record);
    action.play(record);
  }

  moveText(sender, from, to, fromPID, toPID) {
    LOG(`${from}(${fromPID})=>${to}(${toPID})`);
    const project = sender.project;

    const record = [];
    record.push(['moveText', from, to, fromPID, toPID, project.url])
    history.pushUndo(record);
    action.play(record);
  }

  async addPage() {
    const project = namenote.mainView.project;
    if (!project) return;

    const pid = await project.getNewPID()
    let index = project.currentPageIndex() + 1;
    if (index <= 0) index = project.pages.length;

    LOG(`add "page"=>${index}(${pid})`)
    project.addPage(pid, index);
    project.pages[index].initBlank();
    project.views.forEach((view) => {
      if (view.onAddPage) view.onAddPage(pid, index);
    })
  }

  async removePage() {
    const project = namenote.mainView.project;
    if (!project) return;
    
    const index = project.currentPageIndex();
    //if (index < 0) index = 0;
    
    LOG(`remove "page"<=${index}`)
    project.removePage(index);
    project.views.forEach((view) => {
      if (view.onRemovePage) view.onRemovePage(index);
    })
  }
  
  addText(text, to, toPID) {
    const project = namenote.mainView.project;
    if (!project || !project.currentPage) return;
    if (to < 0) to = 0;
    
    LOG(`add "text"=>${to}(${toPID})`)
    project.addText(text, to, toPID);
    project.views.forEach((view) => {
      if (view.onAddText) view.onAddText(text, to, toPID);
    })
  }

  removeText() {
    const project = namenote.mainView.project;
    if (!project) return;

    const pid = project.currentPages[0];
    const tid = project.currentTexts[0];
    if (!pid || !tid) return;

    const page = project.pages.find((page) => page.pid === pid)
    WARN(page.texts);
    
    page.texts.childNodes.forEach((node, index) => {
      if (node.id === 'p' + tid) {
        project.removeText(index, pid);
        project.views.forEach((view) => {
          if (view.onRemoveText) view.onRemoveText(index, pid);
        })
      }
    })
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

    LOG('command.do', item, data);
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
