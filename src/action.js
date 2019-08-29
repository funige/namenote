import { projectManager } from './project-manager.js';
import { pageManager } from './page-manager.js';
import { autosave } from './autosave.js';


class Action {
  play(record) {
    record.forEach((item) => {
      const action = item[0];
      const handler = this.playHandler(action);
      if (this[handler]) {
        this[handler](item.slice(1));
      }
    });
  }

  rewind(record) {
    for (let i = record.length - 1; i >= 0; i--) {
      const item = record[i];
      const action = item[0];
      const handler = this.rewindHandler(action);
      if (this[handler]) {
        this[handler](item.slice(1));
      }
    }
  }

  playHandler(action) {
    const name = 'do' + action.charAt(0).toUpperCase() + action.slice(1);
    return name;
  }

  rewindHandler(action) {
    const name = 'undo' + action.charAt(0).toUpperCase() + action.slice(1);
    return name;
  }

  //
  // do* Actions
  //

  doMovePage([from, to, url] = []) {
    const project = projectManager.find(url);
    if (!project) return;

    project.movePage(from, to);

    autosave.push(project);
    project.views.forEach((view) => {
      view.onMovePage(from, to);
    });
  }

  doAddPage([pid, to, url] = []) {
    const project = projectManager.find(url);
    if (!project) return;

    project.addPage(pid, to);

    autosave.push(project);
    project.views.forEach((view) => {
      view.onAddPage(pid, to);
    });
  }

  doRemovePage([pid, from, url] = []) {
    const project = projectManager.find(url);
    if (!project) return;

    project.removePage(pid, from);

    autosave.push(project);
    project.views.forEach((view) => {
      view.onRemovePage(pid, from);
    });
  }

  doMoveText([from, to, fromPID, toPID, url] = []) {
    const project = projectManager.find(url);
    if (!project) return;

    project.moveText(from, to, fromPID, toPID);

    autosave.push(pageManager.find(project, fromPID));
    autosave.push(pageManager.find(project, toPID));
    project.views.forEach((view) => {
      view.onMoveText(from, to, fromPID, toPID);
    });
  }

  doAddText([text, to, toPID, url] = []) {
    const project = projectManager.find(url);
    if (!project) return;

    project.addText(text, to, toPID);

    autosave.push(pageManager.find(project, toPID));
    project.views.forEach((view) => {
      view.onAddText(text, to, toPID);
    });
  }

  doRemoveText([text, from, fromPID, url] = []) {
    const project = projectManager.find(url);
    if (!project) return;

    project.removeText(text, from, fromPID);

    autosave.push(pageManager.find(project, fromPID));
    project.views.forEach((view) => {
      view.onRemoveText(text, from, fromPID);
    });
  }

  doEditText([fromText, toText, index, pid, url] = []) {
    const project = projectManager.find(url);
    if (!project) return;

    project.editText(toText, index, pid);

    autosave.push(pageManager.find(project, pid));
    project.views.forEach((view) => {
      view.onEditText(toText, index, pid);
    });
  }

  doEditImage([fromImage, toImage, rect, pid, url] = []) {
    const project = projectManager.find(url);
    if (!project) return;

    project.editImage(toImage, rect, pid);

    autosave.push(pageManager.find(project, pid));
    project.views.forEach((view) => {
      view.onEditImage(toImage, rect, pid);
    });
  }

  //
  // undo* Actions
  //

  undoMovePage([from, to, url] = []) {
    this.doMovePage([to, from, url]);
  }

  undoAddPage([pid, to, url] = []) {
    this.doRemovePage([pid, to, url]);
  }

  undoRemovePage([pid, from, url] = []) {
    this.doAddPage([pid, from, url]);
  }

  undoMoveText([from, to, fromPID, toPID, url] = []) {
    this.doMoveText([to, from, toPID, fromPID, url]);
  }

  undoAddText([text, to, toPID, url] = []) {
    this.doRemoveText([text, to, toPID, url]);
  }

  undoRemoveText([text, from, fromPID, url] = []) {
    this.doAddText([text, from, fromPID, url]);
  }

  undoEditText([fromText, toText, index, pid, url] = []) {
    this.doEditText([toText, fromText, index, pid, url]);
  }

  undoEditImage([fromImage, toImage, rect, pid, url] = []) {
    this.doEditImage([toImage, fromImage, rect, pid, url]);
  }
}

const action = new Action();

export { action };
