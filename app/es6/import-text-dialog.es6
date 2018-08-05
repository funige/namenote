'use strict'

import { locale } from './locale.es6'
import { Project } from './project.es6'
import { config } from './config.es6'
import { command } from './command.es6'
import { helper } from './helper.es6'

let path = null
let name = null
let scrupt = []

const formatStrings = {
  'Name changer compatible': {
    line: '\\n',
    balloon: '\\n\\n',
    page: '\\n\\n\\n',
    comment: '’',
  },
  'Namenote': {
    line: '[\\n/]',
    balloon: '\\n\\n',
    page: '##*',
    comment: '#',
  },
}

const importTextDialog = {
  id: 'import-text-dialog',
  element: null,
  
  init: () => {
    $('#import-text-dialog').dialog({
      autoOpen: true,
      position: { at:'center top+150px' },
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
        <option value='Name changer compatible'>T(Name changer compatible)
        <option value='Namenote'>T(Namenote)
        <option value=0>T(Custom)
        </select>
      <tr><td>
      <td><input name='line' class='regexp' type='text' value='\\n' />
          T(Line separator)
      <tr><td>
      <td><input name='balloon' class='regexp' type='text' value='\\n\\n' />
          T(Balloon separator)
      <tr><td>
      <td><input name='page' class='regexp' type='text' value='\\n\\n\\n' />
          T(Page separator)
      <tr><td>
      <td><input name='comment' class='regexp' type='text' value='’' />
          T(Comment key)
    </table>
    <br/>
    </table>
      <tr><td style='height: 1em;'>
      <tr><td><div id='preview' class='preview2'></div>
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
        importTextDialog.updatePreview(url)
      })
    }
    importTextDialog.initForm()
  },

  ok: () => {
    const form = document.forms['import-text']
    const lineSeparator = helper.parseRegexp(form.line)
    const balloonSeparator = helper.parseRegexp(form.balloon)
    const pageSeparator = helper.parseRegexp(form.page)
    const commentKey = helper.parseRegexp(form.comment)

    config.data.lineSeparator = lineSeparator
    config.data.balloonSeparator = balloonSeparator
    config.data.pageSeparator = pageSeparator
    config.data.commentKey = commentKey
    config.save()
    
    command.importText(form, (project) => {
      if (project) {
        importTextDialog.saveParams()
        helper.closeDialog(importTextDialog)
        //$('#import-text-dialog').dialog('close')
      }
    })
    return false
  },

  cancel: () => {
    helper.closeDialog(importTextDialog)
    //$('#import-text-dialog').dialog('close')
  },
      
  initForm: () => {
    const form = document.forms['import-text']
    const d = 'Name changer compatible'
    form.line.value = config.getValue('lineSeparator', formatStrings[d].line)
    form.balloon.value = config.getValue('balloonSeparator', formatStrings[d].balloon)
    form.page.value = config.getValue('pageSeparator', formatStrings[d].page)
    form.comment.value = config.getValue('commentKey', formatStrings[d].comment)
    importTextDialog.getFormat()
    
    $('#import-text input[name="line"]').on('change', function() {
      console.warn("line change")
      importTextDialog.getFormat()
    })
    $('#import-text input[name="balloon"]').on('change', function() {
      console.warn("balloon change")
      importTextDialog.getFormat()
    })
    $('#import-text input[name="page"]').on('change', function() {
      console.warn("page change")
      importTextDialog.getFormat()
    })
    $('#import-text input[name="comment"]').on('change', function() {
      console.warn("comment change")
      importTextDialog.getFormat()
    })

    $('#import-text select[name="format"]').on('change', function() {
      importTextDialog.setFormat()
    })
  },

  setFormat: () => {
    const form = document.forms['import-text']
    const format = form.format.value
    if (formatStrings[format]) {
      form.line.value = formatStrings[format].line
      form.balloon.value = formatStrings[format].balloon
      form.page.value = formatStrings[format].page
      form.comment.value = formatStrings[format].comment
    }
  },

  getFormat: () => {
    const form = document.forms['import-text']
    for (const format in formatStrings) {
      //console.warn('getFormat', format)
      if (formatStrings[format].line != form.line.value) continue
      if (formatStrings[format].balloon != form.balloon.value) continue
      if (formatStrings[format].page != form.page.value) continue
      if (formatStrings[format].comment != form.comment.value) continue
      form.format.value = format
      return
    }
      form.format.value = 0
  },
  
  show: (url) => {
    helper.openDialog(importTextDialog)
    //$('#import-text-dialog').dialog('open')

    const form = document.forms['import-text']
    //form.dir.value = path
    //form.name.value = name
    importTextDialog.showMessage('&nbsp;')
  },

  showBlank: (path) => {
    helper.openDialog(importTextDialog)
    //$('#import-text-dialog').dialog('open')
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
  },

  updatePreview: (filename) => {
    if (namenote.isApp) {
      namenote.app.loadText(filename, (text) => {
        const preview = $('#preview')[0]
        if (text && preview) {
          const script = importTextDialog.parse(text)
          preview.innerHTML = importTextDialog.getPreviewHTML(script)
        }
      })
    }
  },

  parse: (text) => {
    const form = document.forms['import-text']
    const lineRegex = new RegExp(form.line.value)
    const balloonRegex = new RegExp(form.balloon.value)
    const pageRegex = new RegExp(form.page.value)
    const commentRegex = new RegExp('^' + form.comment.value)

    const texts = text.split(/\n/)
    return texts

    /*
    let i = 0
    while (texts[i]) {
      const item = texts[i]
      if (item.match(commentRegex)) {
        
        texts.splice(i, 1)
      }
    } while (texts[++i])
    
        if (texts[i].match(/^[\s]*$/ && text)
      }
    }
    */
  },

  getPreviewHTML: (script) => {
    return script.join('<br>')
  }
}


export { importTextDialog }
