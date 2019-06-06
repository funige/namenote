const MAX_HISTORY = 1000

class History {
  constructor() {
    this.undoItems = []
    this.redoItems = []
  }

  pushUndo(item, holdRedo) {
    LOG('push undo')
    this.undoItems.push(item)
    if (this.undoItems.length > MAX_HISTORY) {
      this.undoItems.shift()
    }
    if (!holdRedo) {
      this.redoItems.length = 0
    }
  }

  pushRedo(item) {
    this.redoItems.push(item)
  }

  popUndo() {
    return this.undoItems.pop()
  }
  
  popRedo() {
    return this.redoItems.pop()
  }

  hasUndo() {
    return (this.undoItems.length > 0) ? true : false
  }
  hasRedo() {
    return (this.redoItems.length > 0) ? true : false
  }
}

const history = new History()

export { history }
