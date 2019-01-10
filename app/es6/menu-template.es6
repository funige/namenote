'use strict'

const menuTemplate = [
  { label: 'Namenote',
    submenu: [
      { label: 'About Namenote ...', click: 'about' },
      { type: 'separator' },
      { label: 'Settings ...', click: 'settings' },
      { label: 'Tablet Settings ...', click: 'tabletSettings' },
      { type: 'separator' },
      { label: 'Quit Namenote', accelerator: "CmdOrCtrl+Q", click: 'quit' },
      
//    { label: 'Settings',
//	submenu: [
//	  { label: 'Reset Settings to Default', click: 'resetSettings' },
//	],
//    },
    ],
  },
  { label: 'Note',
    submenu: [
      { label: 'New ...', accelerator: "CmdOrCtrl+N", click: 'openNewDialog' },
      { label: 'Open ...', accelerator: "CmdOrCtrl+O", click: 'open' },
      { label: 'Open Recent', submenu: [] },

      { type: 'separator' },
//    { label: 'Close', accelerator: "CmdOrCtrl+W", click: 'close' },
//    { label: 'Close All', click: 'closeAll' },
      { label: 'Save Snapshot As ...', accelerator: "CmdOrCtrl+S", click: 'snapshot' },
	
//    { type: 'separator' },
//    { label: 'Note Settings ...', click: 'noteSettings' },

      { type: 'separator' },

//    { label: 'Import',
//	submenu: [
//	  { label: '.txt (Plain Text) ...', accelerator: "CmdOrCtrl+Shift+I", click: 'importTextDialog' },
//	],
//    },
      { label: 'Export',
	submenu: [
	  { label: '.csnf (CLIP STUDIO Storyboard) ...', accelerator: "CmdOrCtrl+P", click: 'exportCSNFDialog' },
	  { label: '.pdf (PDF) ...', accelerator: "CmdOrCtrl+Shift+P", click: 'exportPDFDialog' },
	],
      },
    ],
  },
  { label: "Edit",
    submenu: [
      { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:", click: 'undo' },
      { label: "Redo", accelerator: "CmdOrCtrl+Y", selector: "redo:", click: 'redo' },
      { type: "separator" },
      { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
      { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
      { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },

      { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:", click: 'selectAll' },
    ]
  },
  { label: 'Page',
    submenu: [
      { label: 'Add', accelerator: "Shift+i", click: 'appendPage' },
      { label: 'Move Forward', accelerator: "Shift+.", click: 'movePageForward' },
      { label: 'Move Backward', accelerator: "Shift+,", click: 'movePageBackward' },
      { type: "separator" },
      { label: 'Move to Buffer', accelerator: "Shift+k", click: 'cutPage' },
      { label: 'Put Back from Buffer', accelerator: "Shift+Y", click: 'pastePage' },
      { label: 'Empty Buffer', accelerator: "Shift+0", click: 'emptyPage' },
//    { type: "separator" },
//    { label: 'Flip', accelerator: "H", click: 'flipPage' },
      { type: "separator" },
      { label: 'Extract Text', accelerator: "CmdOrCtrl+T", click: 'extractText' },
      { label: 'Save Image As ...', accelerator: "CmdOrCtrl+-", click: 'savePageImage' },
    ],
  },
  { label: 'View',
    submenu: [
      { label: 'Full Screen', accelerator: 'Ctrl+Command+F', click: 'fullScreen' }, 
//    { label: 'Tool Bar', click: 'toolBar' }, //accelerator: "Command+Alt+H", 
      { label: 'Side Bar', accelerator: 'Command+Alt+S', click: 'sideBar' }, 
      { label: 'Developer Tools', accelerator: "Command+Alt+J", click: 'developerTools' },
      { type: 'separator' },
      { label: 'Page Margin', accelerator: "R", click: 'showMargin' },
      { label: 'Number of Pages per Row',
	submenu: [
	  { label: '2', click: 'row1' },
	  { label: '4', click: 'row2' },
	  { label: '6', click: 'row3' },
	  { label: '8', click: 'row4' },
	],
      }
    ],
  },
/*  
  { label: 'Window',
    submenu: [
    ],
  },
*/
]

const fileMenuTemplate = [
  { label: 'New ...', accelerator: "CmdOrCtrl+N", click: 'openNewDialog' },
  { label: 'Open ...', accelerator: "CmdOrCtrl+O", click: 'open' },
  { type: 'separator' },
]

const otherMenuTemplate = [
  { label: 'Note',
    submenu: [
//    { label: 'Close', accelerator: "CmdOrCtrl+W", click: 'close' },
//    { label: 'Close All', click: 'closeAll' },
      { label: 'Save Snapshot As ...', accelerator: "CmdOrCtrl+S", click: 'snapshot' },
	
      { type: 'separator' },

//    { label: 'Import',
//	submenu: [
//	  { label: '.txt (Plain Text) ...', accelerator: "CmdOrCtrl+Shift+I", click: 'importTextDialog' },
//	],
//    },
      { label: 'Export',
	submenu: [
	  { label: '.csnf (CLIP STUDIO Storyboard) ...', accelerator: "CmdOrCtrl+P", click: 'exportCSNFDialog' },
	  { label: '.pdf (PDF) ...', accelerator: "CmdOrCtrl+Shift+P", click: 'exportPDFDialog' },
	],
      },
    ],
  },
  { label: 'Page',
    submenu: [
      { label: 'Add', accelerator: "Shift+i", click: 'appendPage' },
      { label: 'Move Forward', accelerator: "Shift+.", click: 'movePageForward' },
      { label: 'Move Backward', accelerator: "Shift+,", click: 'movePageBackward' },
      { type: "separator" },
      { label: 'Move to Buffer', accelerator: "Shift+K", click: 'cutPage' },
      { label: 'Put Back from Buffer', accelerator: "Shift+Y", click: 'pastePage' },
      { label: 'Empty Buffer', accelerator: "Shift+0", click: 'emptyPage' },
      { type: "separator" },
      { label: 'Extract Text', accelerator: "CmdOrCtrl+T", click: 'extractText' },
      { label: 'Save Image As ...', accelerator: "CmdOrCtrl+-", click: 'savePageImage' },
    ],
  },
  { label: 'View',
    submenu: [
      { label: 'Full Screen', accelerator: 'Command+Ctrl+F', click: 'fullScreen' }, 
      { label: 'Side Bar', accelerator: 'Command+Alt+S', click: 'sideBar' }, 
      { label: 'Developer Tools', accelerator: "Command+Alt+J", click: 'developerTools' },
      { type: 'separator' },
      { label: 'Page Margin', accelerator: "R", click: 'showMargin' },
      { label: 'Number of Pages per Row',
	submenu: [
	  { label: '2', click: 'row1' },
	  { label: '4', click: 'row2' },
	  { label: '6', click: 'row3' },
	  { label: '8', click: 'row4' },
	],
      }
    ],
  },
/*  
  { label: 'Window',
    submenu: [
    ],
  },
*/
  { type: "separator" },
  { label: 'Settings ...', click: 'settings' },
  { label: 'Tablet Settings ...', click: 'tabletSettings' },
  { label: 'Help', click: 'about' },
]

export { menuTemplate, fileMenuTemplate, otherMenuTemplate }
