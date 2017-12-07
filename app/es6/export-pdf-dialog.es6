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

      <tr><td style='height: 1em;'>
      <tr><td valign=top>T(Pages):
      <td><label><input name='page' type='radio' value=0 >T(All)</label><br/>
	<label><input name='page' type='radio' value=1>T(Current page)</label><br/>
	<label><input name='page' type='radio' value=2>T(Range)
          <input name='from' class='count' value='10' /> -
          <input name='to' class='count' value='10' /></label>

      <tr><td style='height: 0.5em;'>
      <tr><td valign=top>T(Scale):
      <td><select name='scale' class='tmpl'>
        <option value=1>100%

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
      
  initForm: () => {
    const form = document.forms['export-pdf']
    form.scale.value = 1
    form.page.value = 0
    form.from.disabled = true
    form.to.disabled = true

    $('#export-pdf input[type="radio"]').on('change', function() { 
      form.from.disabled = (this.value == 2) ? false : true
      form.to.disabled = (this.value == 2) ? false : true
    })
    
    $('#export-pdf input[name="from"]').on('change', function() { 
      if (this.value < 1) {
	this.value = 1
	this.focus()
      } else if (this.value > parseInt(form.to.value)) {
	this.value = parseInt(form.to.value)
	this.focus()
      }
    })
    $('#export-pdf input[name="to"]').on('change', function() { 
      if (this.value > Project.current.pages.length) {
	this.value = Project.current.pages.length
	this.focus()
      } else if (this.value < parseInt(form.from.value)) {
	this.value = parseInt(form.from.value)
	this.focus()
      }
    })
  },

  show: (path, name) => {
    const form = document.forms['export-pdf']
    form.dir.value = path
    form.name.value = name
    form.from.value = 1
    form.to.value = Project.current.pages.length
    $('#export-pdf-dialog').dialog('open')
    exportPDFDialog.showMessage('&nbsp;')
  },
  
  saveParams: () => {
    const form = document.forms['export-pdf']
    config.data.defaultPath = form.dir.value
    config.save()
  },

  showMessage: (message) => {
    $('#export-pdf-message').html(message)
  }
}


export { exportPDFDialog }
