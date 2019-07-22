const menuTemplate = [
  {
    label: 'Namenote',
    submenu: [
      { label: 'About Namenote ...', click: 'about' },
      { type: 'separator' },
      { label: 'Settings ...', click: 'settings' },
      { label: 'Tablet Settings ...', click: 'tabletSettings' },
      { type: 'separator' },
      { label: 'Quit Namenote', click: 'quit' }
    ]
  },
  {
    label: 'Note',
    submenu: [
      { label: 'New ...', click: 'openNewDialog' },
      { label: 'Open ...', click: 'openDialog' },
      { label: 'Open Recent', submenu: [] },

      { type: 'separator' },
      { label: 'Save Snapshot As ...', click: 'snapshot' },
      { type: 'separator' },
      {
        label: 'Export',
        submenu: [
	  { label: '.csnf (CLIP STUDIO Storyboard) ...', click: 'exportCSNF' },
	  { label: '.pdf (PDF) ...', click: 'exportPDF' }
        ]
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { label: 'Undo', selector: 'undo:', click: 'undo' },
      { label: 'Redo', selector: 'redo:', click: 'redo' },
      { type: 'separator' },
      { label: 'Cut', selector: 'cut:' },
      { label: 'Copy', selector: 'copy:' },
      { label: 'Paste', selector: 'paste:' },

      { label: 'Select All', selector: 'selectAll:', click: 'selectAll' }
    ]
  },
  {
    label: 'Page',
    submenu: [
      { label: 'Add', click: 'appendPage' },
      { label: 'Move Forward', click: 'movePageForward' },
      { label: 'Move Backward', click: 'movePageBackward' },
      { type: 'separator' },
      { label: 'Move to Buffer', click: 'cutPage' },
      { label: 'Put Back from Buffer', click: 'pastePage' },
      { label: 'Empty Buffer', click: 'emptyPage' },
      { type: 'separator' },
      { label: 'Extract Text', click: 'extractText' },
      { label: 'Save Image As ...', click: 'savePageImage' }
    ]
  },
  {
    label: 'View',
    submenu: [
      { label: 'Full Screen', click: 'fullScreen' },
      { label: 'Dock', click: 'dock' },
      { label: 'Developer Tools', click: 'developerTools' },
      { type: 'separator' },
      { label: 'Flip', click: 'flipView' },
      { label: 'Zoom In', click: 'zoom' },
      { label: 'Zoom Out', click: 'unzoom' },
      { type: 'separator' },
      { label: 'Print Preview', click: 'togglePrintPreview' },
      { label: 'Multipage', click: 'toggleMultipage' }
    ]
  }
];

const fileMenuTemplate = [
  { label: 'New ...', click: 'openNewDialog' },
  { label: 'Open ...', click: 'openDialog' },
  { type: 'separator' },
  {
    label: 'Note',
    submenu: [
      { label: 'Save Snapshot As ...', click: 'snapshot' },
      { type: 'separator' },
      {
        label: 'Export',
        submenu: [
	  { label: '.csnf (CLIP STUDIO Storyboard) ...', click: 'exportCSNF' },
	  { label: '.pdf (PDF) ...', click: 'exportPDF' }
        ]
      }
    ]
  },
  {
    label: 'Page',
    submenu: [
      { label: 'Add', click: 'appendPage' },
      { label: 'Move Forward', click: 'movePageForward' },
      { label: 'Move Backward', click: 'movePageBackward' },
      { type: 'separator' },
      { label: 'Move to Buffer', click: 'cutPage' },
      { label: 'Put Back from Buffer', click: 'pastePage' },
      { label: 'Empty Buffer', click: 'emptyPage' },
      { type: 'separator' },
      { label: 'Extract Text', click: 'extractText' },
      { label: 'Save Image As ...', click: 'savePageImage' }
    ]
  },
  {
    label: 'View',
    submenu: [
      { label: 'Full Screen', click: 'fullScreen' },
      { label: 'Dock', click: 'dock' },
      { label: 'Developer Tools', click: 'developerTools' },
      { type: 'separator' },
      { label: 'Flip', click: 'flipView' },
      { label: 'Zoom In', click: 'zoom' },
      { label: 'Zoom Out', click: 'unzoom' },
      { type: 'separator' },
      { label: 'Print Preview', click: 'togglePrintPreview' },
      { label: 'Multipage', click: 'toggleMultipage' }
    ]
  },
  { label: 'File Manager ...', click: 'fileManager' },
  { type: 'separator' },
  { label: 'Settings ...', click: 'settings' },
  { label: 'Tablet Settings ...', click: 'tabletSettings' },
  { label: 'About Namenote ...', click: 'about' }
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
