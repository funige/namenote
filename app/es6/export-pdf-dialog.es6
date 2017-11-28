'use strict'

import { locale } from './locale.es6'
import { Project } from './project.es6'
import { config } from './config.es6'
import { command } from './command.es6'

let path = null
let name = null


const exportPDFDialog = {
  init: () => {
    $('#export-pdf-dialog').dialog({
      autoOpen: false,
      title: T('Export PDF'),
      modal: true,
      width: 550,
      buttons: { Ok: exportPDFDialog.ok, Cancel: exportPDFDialog.cancel },
    })

    const string = locale.translateHTML(`
    <table>
      <tr><td>T(File name):
      <td><input name='name' class='name' type='text' value='' />
	  
      <tr><td>T(Folder):
      <td><input name='dir' class='dir' type='text' value='' disabled />
	<input name='ref' class='ref' type='button' value='T(Choose folder...)' />
        <input type='submit' style='display: none' />
    </table>
    <div id='export-pdf-message' class='dialog-message'></div>
    `)

    $('#export-pdf-dialog').html(`<form id='export-pdf'>${string}</form>`)
    $('#export-pdf').on('submit', function() { return exportPDFDialog.ok() })
    
    const form = document.forms['export-pdf']
    form.ref.onclick = () => {
      command.chooseFolder(document.forms['export-pdf'])
    }
    exportPDFDialog.initForm()
  },

  ok: () => {
    const form = document.forms['export-pdf']
    command.exportPDF(form, (project) => {
      if (project) {
	$('#export-pdf-dialog').dialog('close')
	exportPDFDialog.saveParams()
      }
    })
    return false
  },

  cancel: () => {
    $('#export-pdf-dialog').dialog('close')
  },
      
  initForm: () => {},

  show: (path, name) => {
    const form = document.forms['export-pdf']
    form.dir.value = path
    form.name.value = name
    $('#export-pdf-dialog').dialog('open')
    exportPDFDialog.showMessage('&nbsp;')
  },
  
  saveParams: () => {
    const form = document.forms['export-pdf']
    config.data.defaultPath = form.dir.value
    nn.log('===SAVE DEFAULT PATH===', config.data.defaultPath)
    config.save()
  },

  showMessage: (message) => {
    $('#export-pdf-message').html(message)
  }
}


export { exportPDFDialog }
