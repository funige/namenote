'use strict'

import { locale } from './locale.es6'
import { config } from './config.es6'
import { helper } from './helper.es6'

function decodePosition(string) {
  const array = string.split(',')
  const x = parseFloat(array[0] || 0)
  const y = parseFloat(array[1] || 0)
  return { left:(x * 200) - 15, top:(y * 200) - 15 }
}

function encodePosition(x, y) {
  x = (parseFloat(x || 0) + 15) / 200
  y = (parseFloat(y || 0) + 15) / 200
  console.error('encodePosition', `${x},${y}`)
  return `${x},${y}`
}

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
      <div id="tablet-curve-container">
        <canvas id="tablet-curve" width="200px" height="200px" style="width:200px; height:200px; border: 1px solid black"></canvas>

        <div style="top:-15px; left:-205px; width: 200px; text-align:right;">100%</div>
        <div style="top:85px; left:-205px; width: 200px; text-align:right;">T(Output)</div>
        <div style="top:185px; left:-205px; width: 200px; text-align:right;">0%</div>

        <div style="left:0px; top:200px;">0%</div>
        <div style="left:100px; top:200px;">T(Pen pressure)</div>
        <div style="left:200px; top:200px;">100%</div>

        <div class="control-point" id="tablet-curve-left" style="left:100px; top:-10px"><div></div></div>
        <div class="control-point" id="tablet-curve-right" style="left:200px; top:-20px;"><div></div></div>
        <div class="control-point" id="tablet-curve-center" style="left:0px; top:0px"><div></div></div>
      </div>
    </div>
    <input type='submit' style='display: none' />
    <input name='reset' class='reset' type='button' value='T(Reset Settings to Default)' />
    `)

    $('#tablet-settings-dialog').html(`<form id='tablet'>${string}</form>`)
    $('#tablet').on('submit', function() { return tabletSettingsDialog.ok() })
    document.forms['tablet'].reset.onclick = () => {
      tabletSettingsDialog.resetSettings()
    }
    
    $('#tablet-curve-left').draggable({
      axis: "y",
      drag: function(event, ui) {
        ui.position.top = helper.limit(ui.position.top, -15, 200 - 15)
      }
    }).css({top: 200 - 15, left: -15})
    $('#tablet-curve-right').draggable({
      axis: "y",
      drag: function(event, ui) {
        ui.position.top = helper.limit(ui.position.top, -15, 200 - 15)
      }
    }).css({top: -15, left: 200 - 15})
    $('#tablet-curve-center').draggable({
      drag: function(event, ui) {
        ui.position.top = helper.limit(ui.position.top, -15, 200 - 15)
        ui.position.left = helper.limit(ui.position.left, -15, 200 - 15)
        console.warn('center', ui)
      }
    }).css({top: 100 - 15, left: 100 - 15})


    /*
    $('#tablet-curve-left').on('mousedown', function() { nn.warn('down') })
    $('#tablet-curve-left').on('mouseup', function() { nn.warn('up') })
    $('#tablet-curve-right').on('mousedown', function() { nn.warn('down') })
    $('#tablet-curve-right').on('mouseup', function() { nn.warn('up') })
    $('#tablet-curve-center').on('mousedown', function() { nn.warn('down') })
    $('#tablet-curve-center').on('mouseup', function() { nn.warn('up') })
    */
    
    /*tabletSettingsDialog.updateCanvas()*/

    tabletSettingsDialog.initForm()
  },

  ok: () => {
    $('#tablet-settings-dialog').dialog('close')
    return false
  },

  cancel: () => {
    $('#tablet-settings-dialog').dialog('close')
  },

  initForm: () => {
    const curveLeft = config.getValue('tabletCurveLeft', '0,0')
    const curveRight = config.getValue('tabletCurveRight', '1,0')
    const curveCenter = config.getValue('tabletCurveCenter', '0.5,0.5')

    nn.error(decodePosition(curveLeft), curveLeft, curveRight, curveCenter)
    
    $('#tablet-curve-left').css(decodePosition(curveLeft))
    $('#tablet-curve-right').css(decodePosition(curveRight))
    $('#tablet-curve-center').css(decodePosition(curveCenter))
  },

  resetSettings: () => {
    nn.warn('resetSettings')
    config.data.tabletCurveLeft = '0,0'
    config.data.tabletCurveRight = '1,0'
    config.data.tabletCurveCenter = '0.5,0.5'
    config.save()
    
    tabletSettingsDialog.initForm()
  },
  
  show: () => {
    $('#tablet-settings-dialog').dialog('open')
  },

  updateCanvas: () => {
    nn.warn('updateCanvas....')
    const canvas = $('#tablet-curve')[0]
    const ctx = canvas.getContext('2d')

    const x0 = 0
    const y0 = 0
    const x1 = 100
    const y1 = 100
    
    ctx.beginPath()
    ctx.lineWidth = 1
    ctx.lineCap = 'round'
    ctx.strokeStyle = `rgba(255, 0, 0, 1.0)`

    ctx.moveTo(x0, y0)
    ctx.lineTo(x1, y1)
    ctx.stroke()
  },
}


export { tabletSettingsDialog }
