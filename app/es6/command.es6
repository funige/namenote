'use strict'

import { config } from './config.es6'
import { Project } from './project.es6'
import { Controller } from './controller.es6'
import { View } from './view.es6'
import { Tool } from './tool.es6'
import { Text } from './text.es6'
import { PageBuffer } from './page-buffer.es6'
import { openNewDialog } from './open-new-dialog.es6'
import { exportCSNFDialog } from './export-csnf-dialog.es6'
import { exportPDFDialog } from './export-pdf-dialog.es6'
import { importTXTDialog } from './import-txt-dialog.es6'
import { extractTextDialog } from './extract-text-dialog.es6'
import { Selection } from './selection.es6'

import { configDialog } from './config-dialog.es6'
import { toolButton } from './tool-button.es6'


const command = {
  current: false,
  prev: false,

  do: (item, data) => {
    command.prev = command.current
    command.current = item
    command[item](data)
  },
  
  openNewDialog: () => {
    const path = config.data.defaultPath
    const name = T('Untitled')
    if (namenote.app) {
      namenote.app.fixPath(path, name, (path, name) => {
	openNewDialog.show(path, name)
      })
    }
  },

  chooseFolder: (form) => {
    const path = form.dir.value
    const name = form.name.value
    if (namenote.app) {
      namenote.app.chooseFolder(path, name, (path, name) => {
	form.dir.value = path
	form.name.value = name
      })
    }
  },

  createFolder: (form, callback) => {
    const path = form.dir.value
    const name = form.name.value
    if (namenote.app) {
      namenote.app.createFolder(path, name, (url) => {
	if (url && callback) {
	  callback(url)
	}
      })
    }
  },

  getPID: (project) => {
    if (namenote.app) {
      return namenote.app.getPID(project)
    }
  },
  
  saveProject: (project, callback) => {
    if (namenote.app) {
      namenote.app.saveProject(project, callback)
    }
  },
  
  loadProject: (url, callback) => {
    if (namenote.app) {
      namenote.app.loadProject(url, callback)
    }
  },

  savePage: (project, page, callback) => {
    if (namenote.app) {
      namenote.app.savePage(project, page, callback)
    }
  },

  loadPage: (project, page, callback) => {
    if (namenote.app) {
      namenote.app.loadPage(project, page, callback)
    }
  },

  showMessageBox: (params, callback) => {
    if (namenote.app) {
      namenote.app.showMessageBox(params, callback)
    }
  },
  
  open: () => {
    const path = config.data.defaultPath
    if (namenote.app) {
      namenote.app.openDialog(path, (url) => {
	Project.open(url, (project) => {
	  if (project) {
	    config.data.defaultPath = namenote.app.dirname(url)
	    config.save()
	  }
	})
      })
    }
  },

  openURL: (url) => {
    Project.open(url, (project) => {
      if (project) {
	config.data.defaultPath = namenote.app.dirname(url)
	config.save()
      }
    })
  },
  
  savePageImage: () => {
    if (namenote.app) {
      if (!Project.current) return
      namenote.app.saveImageDialog(null, (url) => {
	if (url) {
	  nn.log('save page image to ->', url)
	  const imageType = url.match(/\.png$/) ? 'image/png' : 'image/jpeg'
	  Project.current.currentPage.capture(imageType, (data) => {
	    if (data) {
	      namenote.app.saveImage(url, data)
	    }
	  })
	}
      })
    }
  },

  snapshot: () => {
    if (namenote.app) {
      const project = Project.current
      if (!project) return
      namenote.app.saveSnapshotDialog(null, project, (url) => {
	if (url) {
	  namenote.app.saveSnapshot(url, project)
	}
      })
    }
  },
  
  extractText: () => {
    if (Project.current) extractTextDialog.show()
  },
  
  undo: (data) => {
    if (Project.current) Project.current.undo()
  },

  redo: (data) => {
    if (Project.current) Project.current.redo()
  },

  cut: (data) => {
  },
  copy: (data) => {
  },
  paste: (data) => {
    if (Project.current) Project.current.paste(data)
  },

  selectAll: (data) => {
    const project = Project.current
    if (project) {
      const selection = project.selection
      const page = project.currentPage
      for (const element of page.texts.childNodes) {
	selection.add(element)
      }
    }
  },

  unselect: (data) => {
    if (Project.current) Project.current.selection.clear()
  },

  importTXTDialog: () => {
    if (Project.current && namenote.app) {
      const path = config.data.defaultPath
      importTXTDialog.showBlank(path)
//    namenote.app.openTxtDialog(path, (url) => {
//	importTXTDialog.show(url)
//    })
    }
  },

  exportPDFDialog: () => {
    if (Project.current && namenote.app) {
      const path = config.data.defaultPath
      const name = Project.current.name() + '.pdf'
      namenote.app.fixPath(path, name, (path, name) => {
	exportPDFDialog.show(path, name)
      })
    }
  },

  exportCSNFDialog: () => {
    if (Project.current && namenote.app) {
      const path = config.data.defaultPath
      const name = Project.current.name() + '.csnf'
      namenote.app.fixPath(path, name, (path, name) => {
	exportCSNFDialog.show(path, name)
      })
    }
  },

  exportCSNF: (form, callback) => {
    const path = form.dir.value
    const name = form.name.value

    if (Project.current && namenote.app) {
      const project = Project.current
      project.setExportSettings(form)
      
      const filename = namenote.app.join(path, name)
      namenote.app.csnf.write(project, filename, (err) => {
	if (!err) {
	  callback(project)
	}
      })
    }
  },
  
  exportPDF: (form, callback) => {
    const path = form.dir.value
    const name = form.name.value

    if (Project.current && namenote.app) {
      const project = Project.current
      project.setExportSettings(form)
      
      const filename = namenote.app.join(path, name)
      namenote.app.pdf.write(project, filename, (err) => {
	if (!err) {
	  callback(project)
	}
      })
    }
  },

  exportPageImage: (form, callback) => {
  },
  
  row1: (data) => { if (Project.current) command.row(1) },
  row2: (data) => { if (Project.current) command.row(2) },
  row3: (data) => { if (Project.current) command.row(3) },
  row4: (data) => { if (Project.current) command.row(4) },
  
  zoom: (data) => {
    View.zoom()
  },

  unzoom: (data) => {
    View.unzoom()
  },

  row: (data) => {
    View.setRowCount(data)
  },
  
  flipPage: (data) => {
//  if (Text.isEditable(document.activeElement)) {
//    nn.log("*pass*")
//    return
//  }
    View.flip()
  },

  rotatePageLeft: (data) => {},
  rotatePageRight: (data) => {},
  zoomPage: (data) => {},
  unzoomPage: (data) => {},

  insertPage: (data) => {
    if (Project.current) Project.current.insertPage()
  },

  appendPage: (data) => {
    if (Project.current) Project.current.appendPage()
  },
  
  cutPage: (data) => {
    if (Project.current) Project.current.cutPage()
  },

  pastePage: (data) => {
    if (Project.current) Project.current.pastePage()
  },

  emptyPage: (data) => {
    PageBuffer.clear()
  },
  
  movePageForward: (data) => {
    const project = Project.current
    if (project) project.movePageForward()
  },

  movePageBackward: (data) => {
    const project = Project.current
    if (project) project.movePageBackward()
  },
  
  movePageLeft: (data) => {
    const project = Project.current
    if (project) {
      (project.params.bind_right) ?
	project.movePageBackward() : project.movePageForward()
    }
  },

  movePageRight: (data) => {
    const project = Project.current
    if (project) {
      (project.params.bind_right) ?
	project.movePageForward() : project.movePageBackward()
    }
  },

  duplicatePage: (data) => {
    if (Project.current) Project.current.duplicatePage()
  },
  
  toggleEditMode: (data) => {
    const project = Project.current
    if (!project) return
    
    let node = document.activeElement
    
    if (Text.isEditable(node)) {
      nn.log('blur..', node)

      project.selection.drop()
      node.blur()
      Tool.setSkip(false)

    } else if (project.selection.list.length == 1) {
      nn.log('focus..', node)
      node = project.selection.list[0]
      if (node) {
	$(node).addClass('editable')
	Text.setEditable(node, true)

	project.selection.lift()
      	node.focus()
      }
    }
  },

  addFontSize: (data) => {
    const element = document.activeElement
    const project = Project.current
    if (!project) return

    if (Text.savedSize && $(element).hasClass('editable')) {
      element.blur()
    } else {
      project.selection.addFontSize(element)
    }
  },
  
  subtractFontSize: (data) => {
    const element = document.activeElement
    const project = Project.current
    if (!project) return

    if (Text.savedSize && $(element).hasClass('editable')) {
      element.blur()
    } else {
      project.selection.subtractFontSize(element);
    }
  },
  
  toggleDirection: (data) => {
    const element = document.activeElement
    const project = Project.current
    if (!project) return

    project.selection.toggleDirection(element)
  },

  cutText: (data) => {
    if (Project.current) Project.current.cut('on baskspace')
  },
  
  hoge: (data) => { nn.log('*hoge*') }, 
  funi: (data) => { nn.log('*funi*') }, 

  pen: (e) => {
    if (!Tool.isSelected('pen')) {
      Tool.select('pen')
    } else {
      Tool.toggleDropdown(e, 'pen')
    }
  },
  
  eraser: (e) => {
    if (!Tool.isSelected('eraser')) {
      Tool.select('eraser')
    } else {
      Tool.toggleDropdown(e, 'eraser')
    }
  },
  
  text: (e) => {
    if (!Tool.isSelected('arrow')) {
      Tool.select('arrow')
    } else {
      Tool.toggleDropdown(e, 'arrow')
    }
  },

  toggleTool: (data) => {
    if (Tool.current === Tool.tools['pen']) {
      Tool.select('eraser')
    } else {
      Tool.select('pen')
    }
  },
  
  toolBar: (data) => {
    namenote.ui.toolBar.toggle()
  },

  sideBar: (data) => {
    namenote.ui.sideBar.toggle()
  },

  showMargin: (data) => {
//  if (Text.isEditable(document.activeElement)) {
//    nn.log("*pass*")
//    return
//  }
    
    if (Project.current) View.toggleShowMargin()
  },
  
  about: (data) => {
    namenote.ui.aboutDialog.show()
  },

  settings: (data) => {
    namenote.ui.configDialog.show()
  },
  
  close: (data) => {
    if (Project.current) Project.close(Project.current)
  },

  closeAll: (data) => {
    Project.closeAll()
  },
  
  reload: (data) => {
    location.reload()
  },

  resetSettings: (data) => {
    config.reset()

    toolButton.init()
    configDialog.initForm()
    configDialog.initColor()
  },

  pageDown: (data) => {
    if (Project.current) View.pageDown()
  },
  
  pageUp: (data) => {
    if (Project.current) View.pageUp()
  },

  pageLeft: (data) => {
    if (Project.current) View.pageLeft()
  },

  pageRight: (data) => {
    if (Project.current) View.pageRight()
  },

  quickZoom: (data) => {
    if (Project.current) View.quickZoom()
  },
  
  developerTools: (data) => { command.runMain('developerTools') },
  quit: (data) => { command.runMain('quit') },

  runMain: (message, data) => {
    if (namenote.isApp) {
      nn.log('runMain', message, data)
      namenote.app.runMain(message, data)

    } else {
      nn.log(`${message}: can\'t execute this command on browser`)
    }
  },
}


export { command }
