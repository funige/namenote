import { namenote } from './namenote.js';
import { projectManager } from './project-manager.js';

/*
//DO
record = []
record.push(['addText', url, pid, index ])
history.pushUndo(record)
action.play(record)
=> action.addText(url, pid, index, isReverse)

//UNDO
record = history.popUndo()
action.rewind(record)

//REDO
record = history.popRedo()
action.play(record)
*/

class Action {
  constructor() {
  }

  play(record) {
    record.forEach((item) => {
      const action = item[0];
      const handler = this.playHandler(action);
      if (this[handler]) {
        this[handler](item.slice(1))
      }
    })
  }

  rewind(record) {
    for (let i = record.length - 1; i >= 0; i--) {
      const item = record[i];
      const action = item[0];
      const handler = this.rewindHandler(action);
      if (this[handler]) {
        this[handler](item.slice(1))
      }
    }
  }

  doMovePage([from, to, url] = []) {
    const project = projectManager.find(url)
    if (!project) return;

    project.movePage(from, to);
    project.views.forEach((view) => {
      view.onMovePage(from, to);
    })
  }

  
  undoMovePage([from, to, url] = []) {
    this.doMovePage([to, from, url]);
  }

  doMoveText([from, to, fromPID, toPID, url] = []) {
    const project = projectManager.find(url)
    if (!project) return;
    
    project.moveText(from, to, fromPID, toPID);
    project.views.forEach((view) => {
      view.onMoveText(from, to, fromPID, toPID);
    })
  }

  undoMoveText([from, to, fromPID, toPID, url] = []) {
    this.doMoveText([to, from, toPID, fromPID, url]);
  }


  // Get hander names
  
  playHandler(action) {
    const name = 'do' + action.charAt(0).toUpperCase() + action.slice(1);
    return name; //this[name];
  }

  rewindHandler(action) {
    const name = 'undo' + action.charAt(0).toUpperCase() + action.slice(1);
    return name; //this[name];
  }
}

const action = new Action();

export { action };
