'use strict'

import { locale } from './locale.es6'
import { config } from './config.es6'
import { helper } from './helper.es6'


const width = 200
const d = 15
//const pressureTableSize = 25
//let pressureTable = null

function decodePosition(string) {
  const array = string.split(',')
  const x = parseFloat(array[0] || 0)
  const y = parseFloat(array[1] || 0)
  return { left:(x * width) - d, top:((1.0 - y) * width) - d }
}

function encodePosition(id) {
  const e = document.getElementById(id)
  const x = (parseFloat(e.style.left || 0) + d) / width
  const y = (parseFloat(e.style.top || 0) + d) / width
  return `${x},${1.0 - y}`
}


////////////////////////////////////////////////////////////////

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
        <canvas id="tablet-curve" width="${width}px" height="${width}px" style="width:${width}px; height:${width}px; border: 1px solid black"></canvas>

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
        ui.position.top = helper.limit(ui.position.top, - d, width - d)
        tabletSettingsDialog.updateCanvas()
      }
    }) //.css({top: width - d, left: -d})
    $('#tablet-curve-right').draggable({
      axis: "y",
      drag: function(event, ui) {
        ui.position.top = helper.limit(ui.position.top, -d, width - d)
        tabletSettingsDialog.updateCanvas()
      }
    }) //.css({top: -d, left: width - d})
    $('#tablet-curve-center').draggable({
      drag: function(event, ui) {
        ui.position.top = helper.limit(ui.position.top, -d, width - d)
        ui.position.left = helper.limit(ui.position.left, -d, width - d)
        tabletSettingsDialog.updateCanvas()
      }
    }) //.css({top: 100 - 15, left: 100 - 15})


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
    const curveLeft = encodePosition('tablet-curve-left')
    const curveRight = encodePosition('tablet-curve-right')
    const curveCenter = encodePosition('tablet-curve-center')
    config.data.tabletCurveLeft = curveLeft
    config.data.tabletCurveRight = curveRight
    config.data.tabletCurveCenter = curveCenter
    config.save()

    config.precalculatePressure();
    
    $('#tablet-settings-dialog').dialog('close')
    return false
  },

  cancel: () => {
    $('#tablet-settings-dialog').dialog('close')
  },

  initForm: () => {
    const curveLeft = config.getValue('tabletCurveLeft', '0,0')
    const curveRight = config.getValue('tabletCurveRight', '1,1')
    const curveCenter = config.getValue('tabletCurveCenter', '0.5,0.5')
    $('#tablet-curve-left').css(decodePosition(curveLeft))
    $('#tablet-curve-right').css(decodePosition(curveRight))
    $('#tablet-curve-center').css(decodePosition(curveCenter))
    tabletSettingsDialog.updateCanvas()
  },

  resetSettings: () => {
    config.data.tabletCurveLeft = '0,0'
    config.data.tabletCurveRight = '1,1'
    config.data.tabletCurveCenter = '0.5,0.5'
    config.save()
    
    tabletSettingsDialog.initForm()
  },
  
  show: () => {
    $('#tablet-settings-dialog').dialog('open')
  },

  updateCanvas: () => {
    const canvas = $('#tablet-curve')[0]
    const ctx = canvas.getContext('2d')

    const left = document.getElementById('tablet-curve-left')
    const right = document.getElementById('tablet-curve-right')
    const center = document.getElementById('tablet-curve-center')
    const x0 = parseFloat(left.style.left) + d
    const y0 = parseFloat(left.style.top) + d
    const x1 = parseFloat(center.style.left) + d
    const y1 = parseFloat(center.style.top) + d
    const x2 = parseFloat(right.style.left) + d
    const y2 = parseFloat(right.style.top) + d

    ctx.clearRect(0, 0, width, width)
    ctx.lineWidth = 1

    ctx.beginPath()
    ctx.strokeStyle = '#ccc'
    ctx.moveTo(x0, y0)
    ctx.lineTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
    
    ctx.beginPath()
    ctx.strokeStyle = 'black'
    ctx.moveTo(x0, y0)
    ctx.quadraticCurveTo(x1, y1, x2, y2)
    ctx.stroke()
  },
}


export { tabletSettingsDialog }
