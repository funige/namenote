'use strict'

import { locale } from './locale.es6'
import { Project } from './project.es6'
import { config } from './config.es6'
import { command } from './command.es6'

let path = null
let name = null


const exportCSNFDialog = {
  init: () => {
    $('#export-csnf-dialog').dialog({
      autoOpen: false,
      title: T('Export CLIP STUDIO Storyboard'),
      modal: true,
      width: 550,
      buttons: { Ok: exportCSNFDialog.ok, Cancel: exportCSNFDialog.cancel },
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
    <div id='export-csnf-message' class='dialog-message'></div>
    `)

    $('#export-csnf-dialog').html(`<form id='export-csnf'>${string}</form>`)
    $('#export-csnf').on('submit', function() { return exportCSNFDialog.ok() })
    
    const form = document.forms['export-csnf']
    form.ref.onclick = () => {
      command.chooseFolder(document.forms['export-csnf'])
    }
    exportCSNFDialog.initForm()
  },

  ok: () => {
    const form = document.forms['export-csnf']
    command.exportCSNF(form, (project) => {
      if (project) {
	$('#export-csnf-dialog').dialog('close')
	exportCSNFDialog.saveParams()
      }
    })
    return false
  },

  cancel: () => {
    $('#export-csnf-dialog').dialog('close')
  },
      
  initForm: () => {},

  show: (path, name) => {
    const form = document.forms['export-csnf']
    form.dir.value = path
    form.name.value = name
    $('#export-csnf-dialog').dialog('open')
    exportCSNFDialog.showMessage('&nbsp;')
  },
  
  saveParams: () => {
    const form = document.forms['export-csnf']
    config.data.defaultPath = form.dir.value
    config.save()
  },

  showMessage: (message) => {
    $('#export-csnf-message').html(message)
  }
}


export { exportCSNFDialog }
