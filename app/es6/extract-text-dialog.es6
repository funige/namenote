'use strict'

import { locale } from './locale.es6'
import { Project } from './project.es6'
import { config } from './config.es6'
import { command } from './command.es6'
import { helper } from './helper.es6'

let path = null
let name = null


const extractTextDialog = {
  id: 'extract-text-dialog',
  element: null,
  
  init: () => {
    $('#extract-text-dialog').dialog({
      autoOpen: true,
      position: { at:'center top+150px' },
      title: T('Extract Text'),
      modal: true,
      width: 550,
      buttons: { Ok: extractTextDialog.ok },
    })

    const string = locale.translateHTML(`
    <table>
      <td><textarea name= 'extract' class='extract'></textarea>
      <input type='submit' style='display: none' />
    </table>`)

    $('#extract-text-dialog').html(`<form id='extract-text'>${string}</form>`)
    $('#extract-text').on('submit', function() { return extractTextDialog.ok() })

    $('#extract-text-dialog').on('keyup', function(e) {
      if (e.keyCode == 13) extractTextDialog.ok()
    })

    $('#extract-text-dialog textarea').on('click', function(e) {
      this.focus()
      this.select()
    })
  },

  ok: () => {
    helper.closeDialog(extractTextDialog)
    //$('#extract-text-dialog').dialog('close')
    return false
  },

  show: (url) => {
    const form = document.forms['extract-text']
    nn.log('show..', Project.current.currentPage.extractText())

    helper.openDialog(extractTextDialog)
    //$('#extract-text-dialog').dialog('open')

    const text = Project.current.currentPage.extractText()
    $('#extract-text-dialog textarea')[0].value = text
  },

  showBlank: (path) => {
    $('#extract-text-dialog').dialog('open')
    namenote.app.openTxtDialog(path, (url) => {
      nn.log('set params...')
    })
  },
  
  saveParams: () => {
    const form = document.forms['extract-text']
    config.data.defaultPath = form.dir.value
    config.save()
  },

//  showMessage: (message) => {
//    $('#extract-text-message').html(message)
//  }
}


export { extractTextDialog }
