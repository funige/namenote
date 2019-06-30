import { historyButton } from './history-button.js';

const MAX_HISTORY = 1000;


class History {
  constructor() {
    this.undoItems = [];
    this.redoItems = [];
  }

  pushUndo(item, holdRedo) {
    this.undoItems.push(item);
    historyButton.update();

    if (this.undoItems.length > MAX_HISTORY) {
      this.undoItems.shift();
    }
    if (!holdRedo) {
      this.redoItems.length = 0;
    }
  }

  pushRedo(item) {
    this.redoItems.push(item);
    historyButton.update();
  }


  popUndo() {
    const item = this.undoItems.pop();
    historyButton.update();
    return item;
  }

  popRedo() {
    const item = this.redoItems.pop();
    historyButton.update();
    return item;
  }

  hasUndo() {
    return (this.undoItems.length > 0);
  }

  hasRedo() {
    return (this.redoItems.length > 0);
  }
}

const history = new History();

export { history };
