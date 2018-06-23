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
    <div style="width:300px; height:300px; font-size:12px;">
      <div style="position:relative; left:40px;">
        <canvas id="tablet-curve" style="position:absolute; width:250px; height:250px; border: 1px solid black"></canvas>

        <div style="position:absolute; top:0px;   left:-205px; width: 200px; text-align:right;">100%</div>
        <div style="position:absolute; top:105px; left:-205px; width: 200px; text-align:right;">出力</div>
        <div style="position:absolute; top:230px; left:-205px; width: 200px; text-align:right;">0%</div>

        <div style="position:absolute; left:0px; top:250px;">0%</div>
        <div style="position:absolute; left:115px; top:250px;">筆圧</div>
        <div style="position:absolute; left:225px; top:250px;">100%</div>

        <div style="position:absolute; left:-5px; top: 95px; width:10px; height:10px; border:1px solid red;"></div>
        <div style="position:absolute; left:95px; top: -5px; width:10px; height:10px; border:1px solid blue;"></div>
      </div>

    </div>
    `)




    $('#tablet-settings-dialog').html(`<form id='tablet'>${string}</form>`)
    $('#tablet').on('submit', function() { return tabletSettingsDialog.ok() })

    $('#tablet-curve').on('mousedown', function() { nn.warn('down') })
    $('#tablet-curve').on('mouseup', function() { nn.warn('up') })
  },

  ok: () => {
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
