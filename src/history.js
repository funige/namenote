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

  play(record) {
    record.forEach((item) => {
      console.warn(`[forward ${type}]`);
      const type = item[0];
      const handler = 'do' + type.charAt(0).toUpperCase() + type.slice(1);
      if (this[handler]) {
        this[handler](item.slice(1));
      }
    })
  }

  rewind(record) {
    console.log(`back ${type}`);
    for (let i = record.length - 1; i >= 0; i--) {
      console.warn(`[rewind ${type}]`);
      const item = record[i];
      const type = item[0];
      const handler = 'undo' + type.charAt(0).toUpperCase() + type.slice(1);
      if (this[handler]) {
        this[handler](item.slice(1));
      }
    }
  }
}

const history = new History();

export { history };
