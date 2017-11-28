'use strict'

// alt+f, alt+e, alt+v, alt+h はウィンドウのメニューに使用
  
const shortcutDefault = {
  undo: ['command+z', 'ctrl+z', 'num/', ','],
  redo: ['command+y', 'ctrl+y', 'num*', '.'],
  openNewDialog: ['command+n', 'alt+n'],
  open: ['command+o', 'alt+o'],
  close: ['command+w', 'alt+w'],
  quit: ['command+q', 'alt+q'],
  reload: ['command+shift+r'],

  exportCSNFDialog: ['command+p', 'alt+p'],
  exportPDFDialog: ['command+shift+p', 'alt+shift+p'],
//importTXTDialog: ['command+shift+i', 'alt+shoft+i'],
  savePageImage: ['command+-', 'alt+-'],
  extractText: ['command+t', 'alt+t'],
  
  pageLeft: 'left',   //'ctrl+f'],
  pageRight: 'right', //'ctrl+b'],
  pageUp: 'up',       //'ctrl+p'],
  pageDown: 'down',   //'ctrl+n'],
  zoom: ['[', 'numplus'],
  unzoom: [']', 'numminus'],

  selectAll: 'ctrl+a',
  unselect: 'ctrl+d',
  
  //sideBar: 'tab',
  developerTools: 'command+alt+j',
  toolBar: 'command+alt+h',

  pen: 'p',
  eraser: 'e',
  text: 't',
  toggleTool: ['x', 'num.'],

  // ページ操作

  insertPage: 'shift+i',
  duplicatePage: 'shift+d',

  showMargin: 'r',
//flipPage: 'h',
  appendPage: 'shift+a',
  cutPage: 'shift+k',
  pastePage: 'shift+y',
  emptyPage: 'shift+0',
  movePageLeft: '<',
  movePageRight: '>',
  row1: 'shift+1',
  row2: 'shift+2',
  row3: 'shift+3',
  row4: 'shift+4',

  // テキスト関係のコマンドはテキスト入力中でも使える
  toggleEditMode: 'ctrl+g',
  addFontSize: 'ctrl+.',
  subtractFontSize: 'ctrl+,',
  toggleDirection: 'ctrl+]',
  cutText: 'backspace',
  
  // test
//hoge: '@ 2', //row2と干渉する
//funi: '@ 1', //row2と干渉する
}


export { shortcutDefault }
