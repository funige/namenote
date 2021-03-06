const shortcutDefault = {
  undo: ['command+z', 'ctrl+z', 'num/', ','],
  redo: ['command+y', 'ctrl+y', 'num*', '.'],
  zoom: ['[', 'q', 'numplus'],
  unzoom: [']', 'a', 'numminus'],
  toggleTool: ['x', 'num.', '/'],

  openNewDialog: ['command+n', 'alt+n'],
  openDialog: ['command+o', 'alt+o'],

  close: ['command+w', 'alt+w'],
  quit: ['command+q', 'alt+q'],
  reload: ['command+shift+r', 'alt+shift+r'],
  //repaint: ['command+r', 'alt+r'],

  exportCSNFDialog: ['command+p', 'alt+p'],
  exportPDFDialog: ['command+shift+p', 'alt+shift+p'],
  importTextDialog: ['command+shift+i', 'alt+shift+i'],
  saveImage: ['command+-', 'alt+-'],
  extractText: ['command+t', 'alt+t'],

  // marginSettingsDialog: ['command+shift+i', 'alt+shift+i'],

  pageLeft: 'left',
  pageRight: 'right',
  pageUp: 'up',
  pageDown: 'down',

  selectAll: 'ctrl+a',
  unselect: 'ctrl+d',
  mergeText: 'ctrl+e',

  dock: '1',
  developerTools: 'command+alt+i',
  
  pen: 'p',
  eraser: 'e',
  text: 't',

  //
  // Page shortcuts
  //

  insertPage: 'shift+i',
  duplicatePage: 'shift+d',

  showMargin: 'r',
  flipView: 'h',
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

  //
  // Text shortcuts (can be used while text editing)
  //

  toggleEditable: 'ctrl+g',
  increaseFontSize: 'ctrl+.',
  decreaseFontSize: 'ctrl+,',
  toggleDirection: 'ctrl+]',
  cutText: 'backspace',
  nextText: 'tab',
  prevText: 'shift+tab'
};

export { shortcutDefault };
