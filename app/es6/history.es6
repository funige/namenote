'use strict'


const max = 1000

class History {
  constructor(project) {
    this.project = project
    this.undoItems = []
    this.redoItems = []
  }

  destructor() {
    this.project = null
  }
  
  pushUndo(item, holdRedo) {
    nn.warn('push undo')
    this.undoItems.push(item)
    if (this.undoItems.length > max) {
      this.undoItems.shift()
    }
    if (!holdRedo) {
      this.redoItems.length = 0
    }
  }

  pushRedo(item) {
    this.redoItems.push(item)
  }

  popUndo() { return this.undoItems.pop() }
  popRedo() { return this.redoItems.pop() }

  hasUndo() { return (this.undoItems.length) > 0 ? true : false }
  hasRedo() { return (this.redoItems.length) > 0 ? true : false }
}


export { History }
