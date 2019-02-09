'use strict'

import { namenote } from './namenote.es6'
import { locale } from './locale.es6'
import { dialog } from './dialog.es6'

////////////////////////////////////////////////////////////////

class OpenNewDialog {
  constructor() {
    this.id = 'open-new-dialog'
    this.element = null
  }

  init() {
    return new Promise((resolve, reject) => {
      const buttons = {}
      buttons[T('Ok')] = resolve
      buttons[T('Cancel')] = reject
      
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
        </table>`)
      
      $(this.element).html(`<form id='open-new'>${string}</form>`)
      $(this.element).dialog({
        autoOpen: false,
        position: { my:'center center', at:'center center' },
        title: T('New'),
        modal: true,
        width: 550,
        buttons: buttons,
      })
    })
  }

  saveParams() {}
}

const openNewDialog = new OpenNewDialog()

export { openNewDialog }
