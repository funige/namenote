'use strict'

import { exportPDFDialog } from './export-pdf-dialog.es6'

const fs = window.require('fs');

const pdfMake = require('pdfmake/build/pdfmake.js')
const pdfFonts = require('pdfmake/build/vfs_fonts.js')
pdfMake.vfs = pdfFonts.pdfMake.vfs;

let images = []
let docDefinition = {}

////////////////////////////////////////////////////////////////

class PDF {}

PDF.initData = (project) => {
  const width = project.exportSize[0]
  const height = project.exportSize[1]
  docDefinition = {
    pageSize: { width: width, height: height },
    pageMargin: [0, 0],
    content: []
  }

  images = []
}

PDF.makeData = (project) => {
  PDF.initData(project)
  
  for (let i = project.exportStart - 1; i <= project.exportEnd - 1; i++) {
//for (let i = 0; i < project.pages.length; i++) {
    const page = project.pages[i]
    images.push(page)
  }
}

PDF.renderData = (list, callback) => {
  if (list.length > 0) {
    const page = list.shift()
    nn.log('...render', page.index)
    exportPDFDialog.showMessage(T('Rendering') + ` ${list.length}...`)
    
    page.capture('image/png', (png) => {
      if (!png) png = page.bg
      
      const item = {
	image: png,
	width: page.project.exportSize[0],
	height: page.project.exportSize[1],
	absolutePosition: { x:0, y:0 },
      }
      if (list.length > 0) item.pageBreak = 'after'
      docDefinition.content.push(item)
      
      PDF.renderData(list, callback)
    })

  } else {
    callback()
  }
}


PDF.write = (project, filename, callback) => {
  nn.log('write', filename, '...')

  PDF.makeData(project)
  PDF.renderData(images, (err) => {
    if (!err) {
      nn.log(docDefinition)
      
      pdfMake.createPdf(docDefinition).getBuffer((buffer) => {
	fs.writeFile(filename, buffer, (err) => {
	  nn.log('pdf finished..')
	  if (callback) callback(err)
	})
      })
    } else nn.log(err)
  })
  
  exportPDFDialog.showMessage(T('Rendering') + `...`)

}


export { PDF }
