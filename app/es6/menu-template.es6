'use strict'

const menuTemplate = [
  { label: 'Namenote',
    submenu: [
      { label: 'About Namenote ...', click: 'about' },
      { type: 'separator' },
      { label: 'Settings ...', click: 'settings' },
      { label: 'Tablet Settings ...', click: 'tabletSettings' },
      { type: 'separator' },
      { label: 'Quit Namenote', click: 'quit' },
      
//    { label: 'Settings',
//	submenu: [
//	  { label: 'Reset Settings to Default', click: 'resetSettings' },
//	],
//    },
    ],
  },
  { label: 'Note',
    submenu: [
      { label: 'New ...', click: 'openNewDialog' },
      { label: 'Open ...', click: 'openDialog' },
      { label: 'Open Recent', submenu: [] },

      { type: 'separator' },
//    { label: 'Close', click: 'close' },
//    { label: 'Close All', click: 'closeAll' },
	
//    { type: 'separator' },
//    { label: 'Note Settings ...', click: 'noteSettings' },

      { label: 'Save Snapshot As ...', click: 'snapshot' },
      { type: 'separator' },

//    { label: 'Import',
//	submenu: [
//	  { label: '.txt (Plain Text) ...', click: 'importTextDialog' },
//	],
//    },
      { label: 'Export',
	submenu: [
	  { label: '.csnf (CLIP STUDIO Storyboard) ...', click: 'exportCSNF' },
	  { label: '.pdf (PDF) ...', click: 'exportPDF' },
	],
      },
    ],
  },
  { label: "Edit",
    submenu: [
      { label: "Undo", selector: "undo:", click: 'undo' },
      { label: "Redo", selector: "redo:", click: 'redo' },
      { type: "separator" },
      { label: "Cut", selector: "cut:" },
      { label: "Copy", selector: "copy:" },
      { label: "Paste", selector: "paste:" },

      { label: "Select All", selector: "selectAll:", click: 'selectAll' },
    ]
  },
  { label: 'Page',
    submenu: [
      { label: 'Add', click: 'appendPage' },
      { label: 'Move Forward', click: 'movePageForward' },
      { label: 'Move Backward', click: 'movePageBackward' },
      { type: "separator" },
      { label: 'Move to Buffer', click: 'cutPage' },
      { label: 'Put Back from Buffer', click: 'pastePage' },
      { label: 'Empty Buffer', click: 'emptyPage' },
//    { type: "separator" },
//    { label: 'Flip', click: 'flipPage' },
      { type: "separator" },
      { label: 'Extract Text', click: 'extractText' },
      { label: 'Save Image As ...', click: 'savePageImage' },
    ],
  },
  { label: 'View',
    submenu: [
      { label: 'Full Screen', click: 'fullScreen' }, 
//    { label: 'Tool Bar', click: 'toolBar' },
      { label: 'Side Bar', click: 'sideBar' }, 
      { label: 'Developer Tools', click: 'developerTools' },
      { type: 'separator' },
      { label: 'Zoom In', click: 'zoom' }, 
      { label: 'Zoom Out', click: 'unzoom' }, 
      { type: 'separator' },
      { label: 'Page Margin', click: 'showMargin' },
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
]

const fileMenuTemplate = [
  { label: 'New ...', click: 'openNewDialog' },
  { label: 'Open ...', click: 'openDialog' },
  { type: 'separator' },
  { label: 'Note',
    submenu: [
//    { label: 'Close', click: 'close' },
//    { label: 'Close All', click: 'closeAll' },
      { label: 'Save Snapshot As ...', click: 'snapshot' },
      { type: 'separator' },

//    { label: 'Import',
//	submenu: [
//	  { label: '.txt (Plain Text) ...', click: 'importTextDialog' },
//	],
//    },
      { label: 'Export',
	submenu: [
	  { label: '.csnf (CLIP STUDIO Storyboard) ...', click: 'exportCSNF' },
	  { label: '.pdf (PDF) ...', click: 'exportPDF' },
	],
      },
    ],
  },
  { label: 'Page',
    submenu: [
      { label: 'Add', click: 'appendPage' },
      { label: 'Move Forward', click: 'movePageForward' },
      { label: 'Move Backward', click: 'movePageBackward' },
      { type: "separator" },
      { label: 'Move to Buffer', click: 'cutPage' },
      { label: 'Put Back from Buffer', click: 'pastePage' },
      { label: 'Empty Buffer', click: 'emptyPage' },
      { type: "separator" },
      { label: 'Extract Text', click: 'extractText' },
      { label: 'Save Image As ...', click: 'savePageImage' },
    ],
  },
  { label: 'View',
    submenu: [
      { label: 'Full Screen', click: 'fullScreen' }, 
      { label: 'Side Bar', click: 'sideBar' }, 
      { label: 'Developer Tools', click: 'developerTools' },
      { type: 'separator' },
      { label: 'Zoom In', click: 'zoom' }, 
      { label: 'Zoom Out', click: 'unzoom' }, 
      { type: 'separator' },
      { label: 'Page Margin', click: 'showMargin' },
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
  { type: "separator" },
  { label: 'File Manager ...', click: 'fileManager' },
  { type: "separator" },
  { label: 'Settings ...', click: 'settings' },
  { label: 'Tablet Settings ...', click: 'tabletSettings' },
  { label: 'About Namenote ...', click: 'about' },
]

const sidebarMenuTemplate = [
  { label: 'サイドバーの位置',
    submenu: [
      { label: '左', click: 'dockLeft' },
      { label: '右', click: 'dockRight' },
    ],
  },
]

export { menuTemplate, fileMenuTemplate, sidebarMenuTemplate }
