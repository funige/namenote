'use strict'

import { locale } from './locale.es6'
import { config } from './config.es6'
import { View } from './view.es6'
import { Text } from './text.es6'
import { command } from './command.es6'
import { helper } from './helper.es6'


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
      <tr><td>T(Text color):
          <td><input id='config-dialog-color' name='color' type='color' />
    </table>

    <br/>
    <table>
      <tr><td><label><input name='zoom' type='checkbox'/> T(Zoom small texts on input)</label>
          <input name='zoomSize' class='count' value='' /> px</label>

      <tr><td style='height: 1em;'>
      <tr><td><label><input name='noScroll' type='checkbox'/> T(Can not draw because the canvas scrolls on drag)</label>

      <br/>
      <br/>
      <br/>
      <br/>
      <input type='submit' style='display: none' />
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
    configDialog.initColor()
  },

  ok: () => {
    const form = document.forms['config']
    const noScroll = (form.noScroll.checked) ? true : false
    const zoomFont = (form.zoom.checked) ? true : false
    const zoomFontSize = parseInt(form.zoomSize.value || 8)

    config.data.noScroll = noScroll
    config.data.zoomFont = zoomFont
    config.data.zoomFontSize = zoomFontSize
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

    const zoomFont = config.getValue('zoomFont', false)
    const zoomFontSize = Text.getZoomFontSize()

    form.zoom.checked = zoomFont
    form.zoomSize.value = zoomFontSize
    form.zoomSize.disabled = (zoomFont) ? false : true

    $('#config input[name="zoom"]').on('change', function() {
      form.zoomSize.disabled = (this.checked) ? false : true
    })

    $('#config input[name="zoomSize"]').on('change', function() {
      this.value = parseInt(this.value) || 8
      if (this.value < 8) this.value = 8
      if (this.value > 32) this.value = 32
    })
  },
  
  show: () => {
    $('#config-dialog').dialog('open')
  },

  initColor: () => {
    const textColor = Text.getTextColor()
    helper.addRule('.text', 'color', textColor)
    
    $("#config-dialog-color").spectrum({
      showPaletteOnly: true,
      showPalette: true,
      color: textColor,
      palette: [
        ['#000000', '#bf0058', '#ff00ff', '#0097d4', '#e2b800'],
      ],
      hide: function (color) {
	const textColor = color.toHexString()
	helper.addRule('.text', 'color', textColor)
	config.data.textColor = textColor
	config.save()
      }
    });
  },
}


export { configDialog }
