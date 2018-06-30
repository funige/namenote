'use strict'

import { locale } from './locale.es6'

const tabletSettingsDialog = {
  init: () => {
    $('#tablet-settings-dialog').dialog({
      autoOpen: false,
      title: T('Tablet Settings'),
      modal: true,
      width: 360,
      buttons: { Ok: tabletSettingsDialog.ok, Cancel: tabletSettingsDialog.cancel },
      open: function() {
        $(this).parent().find('button:nth-child(1)').focus();
      }
    })

    const string = locale.translateHTML(`
    <div style="width:300px; height:250px; font-size:12px;">
      <div style="position:relative; left:40px;">
        <canvas id="tablet-curve" style="position:absolute; width:200px; height:200px; border: 1px solid black"></canvas>

        <div style="position:absolute; top:-15px; left:-205px; width: 200px; text-align:right;">100%</div>
        <div style="position:absolute; top:85px; left:-205px; width: 200px; text-align:right;">T(Output)</div>
        <div style="position:absolute; top:185px; left:-205px; width: 200px; text-align:right;">0%</div>

        <div style="position:absolute; left:0px; top:200px;">0%</div>
        <div style="position:absolute; left:100px; top:200px;">T(Pen pressure)</div>
        <div style="position:absolute; left:200px; top:200px;">100%</div>

        <div style="position:absolute; left:0px; top: 100px; width:5px; height:5px; border:1px solid blue;"></div>
        <div style="position:absolute; left:0px; top: 0px; width:5px; height:5px; border:1px solid red;"></div>
        <div style="position:absolute; left:200px; top: 0px; width:5px; height:5px; border:1px solid red;"></div>
      </div>
    </div>
    <input type='submit' style='display: none' />
    <input name='reset' class='reset' type='button' value='T(Reset Settings to Default)' />
    `)

    $('#tablet-settings-dialog').html(`<form id='tablet'>${string}</form>`)
    $('#tablet').on('submit', function() { return tabletSettingsDialog.ok() })

    $('#tablet-curve').on('mousedown', function() { nn.warn('down') })
    $('#tablet-curve').on('mouseup', function() { nn.warn('up') })
  },

  ok: () => {
    $('#tablet-settings-dialog').dialog('close')
    return false
  },

  cancel: () => {
    $('#tablet-settings-dialog').dialog('close')
  },

  initForm: () => {
  },

  show: () => {
    $('#tablet-settings-dialog').dialog('open')
  },
}


export { tabletSettingsDialog }
