import { namenote } from './namenote.js'

class Action {
  constructor() {
  }

  funige({options, hoge, funi} = {}) {
    LOG('movePage', options, hoge, funi)
  }
  
  movePage(options) {
  }
  
  removePage(options) {
  }
  
  addPage(options) {
  }
    
  moveText(options) {
  }
  
  removeText(options) {
  }
  
  addText(options) {
  }
  
  editText(options) {
  }

  editImage(options) {
  }
}

const action = new Action()

export { action }
