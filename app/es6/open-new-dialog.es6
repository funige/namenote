'use strict'

import { locale } from './locale.es6'
import { Project } from './project.es6'
import { config } from './config.es6'
import { command } from './command.es6'
import { projectTemplate } from './project-template.es6'


const openNewDialog = {
  init : () => {
    $('#open-new-dialog').dialog({
      autoOpen: false,
      title: T('New'),
      modal: true,
      width: 550,
      buttons: { Ok: openNewDialog.ok, Cancel: openNewDialog.cancel },
    })

    const string = locale.translateHTML(`
    <table>
      <tr><td>T(Notebook name):
      <td><input name='name' class='name' type='text' value='' />
	  
      <tr><td>T(Folder):
      <td><input name='dir' class='dir' type='text' value='' disabled />
	<input name='ref' class='ref' type='button' value='T(Choose folder...)' />

      <tr><td>T(Number of pages):
      <td><input name='count' class='count' type='text' value=8 /><br>

      <tr><td style='height: 1em;'>
      <tr><td>T(Template):
	<td><select name='tmpl' class='tmpl'>
	    <option value='Manga'>T(Manga)</select>

      <tr><td>T(Binding point):
      <td><label><input name='bind' type='radio' value=0>T(Left binding)</label>
        <label><input name='bind' type='radio' checked value=1>T(Right binding)</label>

      <tr><td>T(Start page):
      <td><label><input name='start' type='radio' value=0 checked>T(From left)</label>
	<label><input name='start' type='radio' value=1>T(From right)</label>

      <input type='submit' style='display: none' />
    </table>`
    )

    $('#open-new-dialog').html(`<form id='open-new'>${string}</form>`)
    $('#open-new').on('submit', function() { return openNewDialog.ok() })

    const form = document.forms['open-new']
    form.ref.onclick = () => {
      command.chooseFolder(document.forms['open-new'])
    }
    openNewDialog.initForm('Manga')
  },

  ok: () => {
    const form = document.forms['open-new']
    command.createFolder(form, (url) => {
      $('#open-new-dialog').dialog('close')
      openNewDialog.saveParams()
      const project = Project.create(url, openNewDialog.getForm())
      command.saveProject(project, (err) => {
	if (err) nn.log(err)
      })
    })
    return false
  },

  cancel: () => {
    $('#open-new-dialog').dialog('close')
  },
  
  initForm: (templateName) => {
    const template = projectTemplate[templateName].params
    if (template) {
      const form = document.forms['open-new']
      form.count.value = template.page_count
      form.bind.value = (template.bind_right) ? "1" : "0"
      form.start.value = (template.startpage_right) ? "1" : "0"
    }
  },

  getForm: () => {
    const form = document.forms['open-new']
    const template = projectTemplate[form.tmpl.value].params
    if (template) {
      const params = $.extend(true, {}, template)
      params.page_count = form.count.value
      params.bind_right = (form.bind.value == "1")
      params.startpage_right = (form.start.value == "1")
      return { 'params': params }
    }
    alert(`Error: Unknown Template '${form.tmpl.value}'`)
    return null
  },


  show: (path, name) => {
    const form = document.forms['open-new']
    form.dir.value = path
    form.name.value = name
    $('#open-new-dialog').dialog('open')
  },
  
  saveParams: () => {
    const form = document.forms['open-new']
    config.data.defaultPath = form.dir.value
    config.save()
  }
}


export { openNewDialog }
