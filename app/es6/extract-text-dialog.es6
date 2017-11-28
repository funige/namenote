'use strict'

import { locale } from './locale.es6'
import { Project } from './project.es6'
import { config } from './config.es6'
import { command } from './command.es6'

let path = null
let name = null


const extractTextDialog = {
  init: () => {
    $('#extract-text-dialog').dialog({
      autoOpen: false,
      title: T('Extract Text'),
      modal: true,
      width: 550,
      buttons: { Ok: extractTextDialog.ok }, //Cancel: extractTextDialog.cancel },
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
    $('#extract-text-dialog').dialog('close')
  },

  show: (url) => {
    const form = document.forms['extract-text']
    nn.log('show..', Project.current.currentPage.extractText())

    const text = Project.current.currentPage.extractText()
    $('#extract-text-dialog textarea')[0].value = text
    $('#extract-text-dialog').dialog('open')
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
