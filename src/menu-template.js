const menuTemplate = [];

const fileMenuTemplate = [
  { label: 'New ...', click: 'openNewDialog' },
  { label: 'Open ...', click: 'openDialog' },
  { type: 'separator' },
  {
    label: 'Note',
    submenu: [
      { label: 'Export CSNF ...', click: 'exportCSNF' },
      { label: 'Export PDF ...', click: 'exportPDF' },
    ]
  },
  {
    label: 'Page',
    submenu: [
      { label: 'Save Image As ...', click: 'saveImage' },
    ]
  },
  {
    label: 'View',
    submenu: [
      { label: 'Full Screen', click: 'fullScreen' },
      { label: 'Dock', click: 'dock' },
      { label: 'Developer Tools', click: 'developerTools' },
      { type: 'separator' },
      { label: 'Multipage', click: 'toggleMultipage' },
      { label: 'Repaint', click: 'repaint' },
    ]
  },
  { type: 'separator' },
  { label: 'Settings ...', click: 'settings' },
  { label: 'Tablet Settings ...', click: 'tabletSettings' },
  { label: 'About Namenote ...', click: 'about' },

  { type: 'separator' },
  { label: 'Quit Namenote', click: 'quit' }
];

const dockMenuTemplate = [
  {
    label: 'Dock Side',
    submenu: [
      { label: 'Left', click: 'dockSide.left' },
      { label: 'Right', click: 'dockSide.right' }
    ]
  },
  {
    label: 'Thumbnail Size',
    submenu: [
      { label: 'Small', click: 'thumbnailSize.small' },
      { label: 'Middle', click: 'thumbnailSize.middle' },
      { label: 'Large', click: 'thumbnailSize.large' }
    ]
  },
  { type: 'separator' },
  {
    label: 'Font Size',
    submenu: [
      { label: 'Small', click: 'thumbnailSize.small' },
      { label: 'Middle', click: 'thumbnailSize.middle' },
      { label: 'Large', click: 'thumbnailSize.large' }
    ]
  }
];

export { menuTemplate, fileMenuTemplate, dockMenuTemplate };
