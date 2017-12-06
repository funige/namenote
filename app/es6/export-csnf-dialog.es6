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

      <tr><td style='height: 1em;'>
      <tr><td valign=top>T(Pages):
      <td><label><input name='page' type='radio' value=0 >T(All)</label><br/>
	<label><input name='page' type='radio' value=1>T(Current page)</label><br/>
	<label><input name='page' type='radio' value=2>T(Range)
          <input name='from' class='count' value='10' /> -
          <input name='to' class='count' value='10' /></label>

      <tr><td valign=top>T(Scale):
      <td><select name='scale' class='tmpl'>
        <option value=100>100%
        <option value=81>81% (B4 → A4)<select>

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
      
  initForm: () => {
    const form = document.forms['export-csnf']
    form.scale.value = 100
    form.page.value = 0
    form.from.disabled = true
    form.to.disabled = true

    $('#export-csnf input[type="radio"]').on('change', function() { 
      form.from.disabled = (this.value == 2) ? false : true
      form.to.disabled = (this.value == 2) ? false : true
    })
    
    $('#export-csnf input[name="from"]').on('change', function() { 
      if (this.value < 1) {
	this.value = 1
	this.focus()
      } else if (this.value > form.to.value) {
	this.value = form.to.value
	this.focus()
      }
    })
    $('#export-csnf input[name="to"]').on('change', function() { 
      if (this.value > Project.current.pages.length) {
	this.value = Project.current.pages.length
	this.focus()
      } else if (this.value < form.from.value) {
	this.value = form.from.value
	this.focus()
      }
    })
  },

  show: (path, name) => {
    const form = document.forms['export-csnf']
    form.dir.value = path
    form.name.value = name
    form.from.value = 1
    form.to.value = Project.current.pages.length
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
