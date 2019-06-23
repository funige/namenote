import { namenote } from './namenote.js';
import { projectManager } from './project-manager.js';

/*
//DO
item = ['addText', url, pid, index ]
history.pushUndo(item)
action.play(item)
=> action.addText(url, pid, index, isReverse)

//UNDO
item = history.popUndo()
action.rewind(item)

//REDO
item = history.popRedo()
action.play(item)
*/

class Action {
  constructor() {
  }

/*
  movePage(oldIndex, newIndex, oldURL, newURL) {
    const project = projectManager.find(oldURL)
    if (!project) return

    LOG('movePage', oldIndex, newIndex, oldURL, newURL)
    project.pages.move(oldIndex, newIndex)
  }

  removePage(pid, index, url) {
    LOG(pid, index, url)
  }

  addPage(pid, index, url) {
  }

  moveText(oldIndex, newIndex, oldPID, newPID, oldURL, newURL) {
  }

  removeText(text, index, pid, url) {
  }

  addText(text, index, pid, url) {
  }

  editText(oldText, newText, index, pid, url) {
  }

  editImage(oldImage, newImage, x, y, w, h, pid, url) {
  }

  play(item) {
    const action = item.shift()
    switch (action) {
    case 'movePage':
      const [oldIndex, newIndex, oldURL, newURL] = item
      LOG('play-movePage', oldIndex, newIndex)
      this.movePage(oldIndex, newIndex, oldURL, newURL)
      break;

    default:
      LOG(action, 'not played')
      break;
    }
  }

  rewind(item) {
    const action = item.shift()
    switch (action) {
    case 'movePage':
      const [oldIndex, newIndex, oldURL, newURL] = item
      this.movePage(newIndex, oldIndex, newURL, oldURL)
      break;

    default:
      LOG(action, 'not rewinded')
    }
  }

  //if (this[action]) {
  //  this[action](...item)
  //}
*/
}

const action = new Action();

export { action };
