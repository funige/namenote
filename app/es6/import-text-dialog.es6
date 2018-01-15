'use strict'

import { locale } from './locale.es6'
import { Project } from './project.es6'
import { config } from './config.es6'
import { command } from './command.es6'

let path = null
let name = null


const importTextDialog = {
  init: () => {
    $('#import-text-dialog').dialog({
      autoOpen: false,
      title: T('Import Plain Text'),
      modal: true,
      width: 550,
      buttons: { Ok: importTextDialog.ok, Cancel: importTextDialog.cancel },
    })

    const string = locale.translateHTML(`
    <table>
      <tr><td>T(File name):
      <td><input name='name' class='dir' type='text' value='' placeholder='T(Select file to import)' disabled />
      <input name='ref' class='ref' type='button' value='T(Choose file...)' />

      <tr><td style='height: 1em;'>
      <tr><td valign=top>T(Format):
      <td><select name='format' class='tmpl2'>
        <option value=1>ストーリーエディタ用ネームチェンジャー互換
        <option value=0>T(Custom)
        </select>
      <tr><td>
      <td><input name='line' class='regex' type='text' value='\\n' />
          T(Line separator)
      <tr><td>
      <td><input name='balloon' class='regex' type='text' value='\\n\\n' />
          T(Text area separator)
      <tr><td>
      <td><input name='page' class='regex' type='text' value='\\n\\n\\n' />
          T(Page separator)
      <tr><td>
      <td><input name='key' class='regex' type='text' value='’' />
          T(Comment key)
    </table>
    <br/>
    </table>
      <tr><td style='height: 1em;'>
      <tr><td><div class='preview2'></div>
    </table>
    <table>
      <tr><td>T(Number of pages):
      <td><input name='count' class='count2' type='text' value='8' disabled />

      <input type='submit' style='display: none' />
    </table>
    <div id='import-text-message' class='dialog-message'></div>
    `)

    $('#import-text-dialog').html(`<form id='import-text'>${string}</form>`)
    $('#import-text').on('submit', function() { return importTextDialog.ok() })
    
    const form = document.forms['import-text']
    form.ref.onclick = () => {
      command.chooseFile(document.forms['import-text'], (url) => {
	form.name.value = url
	importTextDialog.updatePreview()
      })
    }
    importTextDialog.initForm()
  },

  ok: () => {
    const form = document.forms['import-text']
    command.importText(form, (project) => {
      if (project) {
	$('#import-text-dialog').dialog('close')
	importTextDialog.saveParams()
      }
    })
    return false
  },

  cancel: () => {
    $('#import-text-dialog').dialog('close')
  },
      
  initForm: () => {},

  updatePreview: () => {
    const form = document.forms['import-text']
    console.log('update preview for', form.name.value)
  },
  
  show: (url) => {
    const form = document.forms['import-text']
    //form.dir.value = path
    //form.name.value = name
    $('#import-text-dialog').dialog('open')
    importTextDialog.showMessage('&nbsp;')
  },

  showBlank: (path) => {
    $('#import-text-dialog').dialog('open')
//  namenote.app.openTextDialog(path, (url) => {
//    nn.log('set params...')
//  })
  },
  
  saveParams: () => {
    const form = document.forms['import-text']
    config.data.defaultPath = form.dir.value
    config.save()
  },

  showMessage: (message) => {
    $('#import-text-message').html(message)
  }
}


export { importTextDialog }
