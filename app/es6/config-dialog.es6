'use strict'

import { locale } from './locale.es6'
import { config } from './config.es6'
import { View } from './view.es6'
import { command } from './command.es6'


const configDialog = {
  init: () => {
    $('#config-dialog').dialog({
      autoOpen: false,
      title: T('Settings'),
      modal: true,
      width: 600,
      buttons: { Ok: configDialog.ok, Cancel: configDialog.cancel },
    })

    const string = locale.translateHTML(`
    <table>
      <tr><td><label><input name='noScroll' type='checkbox'/> T(Can not draw because the canvas scrolls on drag.)</label>
      <input type='submit' style='display: none' />
      <br/>
      <br/>
      <input name='reset' class='reset' type='button' value='T(Reset Settings to Default)' />
    </table>
    `)
    
    $('#config-dialog').html(`<form id='config'>${string}</form>`)
    $('#config').on('submit', function() { return configDialog.ok() })
    document.forms['config'].reset.onclick = () => {
      if (confirm(T('Click OK to restore default settings.'))) {
	command.resetSettings()
      }
    }
    
    configDialog.initForm()
  },

  ok: () => {
    const form = document.forms['config']
    const noScroll = (form.noScroll.checked) ? true : false
    nn.log('noScroll=', noScroll)
    config.data.noScroll = noScroll
    config.save()

    View.setNoScroll()
    $('#config-dialog').dialog('close')
    return false
  },

  cancel: () => {
    $('#config-dialog').dialog('close')
  },

  initForm: () => {
    const form = document.forms['config']
    form.noScroll.checked = (config.data.noScroll) ? true : false
  },
  
  show: () => {
    $('#config-dialog').dialog('open')
  },
}


export { configDialog }
