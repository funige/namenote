'use strict'

import { locale } from './locale.es6'
import { Project } from './project.es6'
import { config } from './config.es6'
import { command } from './command.es6'

let path = null
let name = null


const importTXTDialog = {
  init: () => {
    $('#import-txt-dialog').dialog({
      autoOpen: false,
      title: T('Import Plain Text'),
      modal: true,
      width: 550,
      buttons: { Ok: importTXTDialog.ok, Cancel: importTXTDialog.cancel },
    })

    const string = locale.translateHTML(`
    <table>
      <tr><td>T(File name):
      <td><input name='name' class='dir' type='text' value='hoge' disabled />
      <input name='ref' class='ref' type='button' value='T(Choose file...)' />

      <tr><td>T(Number of pages):
      <td><input name='count' class='count2' type='text' value='8' disabled />

      <tr><td>T(Comment key):
      <td><input name='key' class='key' type='text' value='’' />
          <input type='submit' style='display: none' />
    </table>
    <div id='import-txt-message' class='dialog-message'></div>
    `)

    $('#import-txt-dialog').html(`<form id='import-txt'>${string}</form>`)
    $('#import-txt').on('submit', function() { return importTXTDialog.ok() })
    
    const form = document.forms['import-txt']
    form.ref.onclick = () => {
      command.chooseFolder(document.forms['import-txt'])
    }
    importTXTDialog.initForm()
  },

  ok: () => {
    const form = document.forms['import-txt']
    command.importTXT(form, (project) => {
      if (project) {
	$('#import-txt-dialog').dialog('close')
	importTXTDialog.saveParams()
      }
    })
    return false
  },

  cancel: () => {
    $('#import-txt-dialog').dialog('close')
  },
      
  initForm: () => {},

  show: (url) => {
    const form = document.forms['import-txt']
    //form.dir.value = path
    //form.name.value = name
    $('#import-txt-dialog').dialog('open')
    importTXTDialog.showMessage('&nbsp;')
  },

  showBlank: (path) => {
    $('#import-txt-dialog').dialog('open')
    namenote.app.openTxtDialog(path, (url) => {
      nn.log('set params...')
    })
  },
  
  saveParams: () => {
    const form = document.forms['import-txt']
    config.data.defaultPath = form.dir.value
    config.save()
  },

  showMessage: (message) => {
    $('#import-txt-message').html(message)
  }
}


export { importTXTDialog }
