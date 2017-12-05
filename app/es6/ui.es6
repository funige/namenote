'use strict'

import { locale } from './locale.es6'
import { Menu } from './menu.es6'
import { Title } from './title.es6'
import { sideBar } from './side-bar.es6'
import { toolBar } from './tool-bar.es6'
import { widget } from './widget.es6'

import { aboutDialog } from './about-dialog.es6'
import { configDialog } from './config-dialog.es6'
import { openNewDialog } from './open-new-dialog.es6'
import { exportCSNFDialog } from './export-csnf-dialog.es6'
import { exportPDFDialog } from './export-pdf-dialog.es6'
import { importTXTDialog } from './import-txt-dialog.es6'
import { extractTextDialog } from './extract-text-dialog.es6'


const ui = {
  sideBar: sideBar,
  toolBar: toolBar,
  widget: widget,

  aboutDialog: aboutDialog,
  configDialog: configDialog,
  openNewDialog: openNewDialog,
  exportCSNFDialog: exportCSNFDialog,
  exportPDFDialog: exportPDFDialog,
  importTXTDialog: importTXTDialog,
  extractTextDialog: extractTextDialog,
  
  init: () => {
    ui.widget.init()

    Menu.init()
    Title.init()
    
    ui.sideBar.init()
    ui.toolBar.init()

    ui.aboutDialog.init()
    ui.configDialog.init()
    ui.openNewDialog.init()
    ui.exportCSNFDialog.init()
    ui.exportPDFDialog.init()
    ui.importTXTDialog.init()
    ui.extractTextDialog.init()

    $('.split-pane').css('opacity', 1) // start the show
  },

  update: () => {
    ui.toolBar.update()
    ui.sideBar.update()
  },

  isDialogOpen: () => {
    for (const dialog of $('.ui-dialog-content')) {
      if ($(dialog).dialog('isOpen')) {
	return true
      }
    }
    return false
  },
}

locale.init()


export { ui }
