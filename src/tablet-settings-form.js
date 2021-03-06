import { locale, T } from './locale.js';
import { config } from './config.js';
import { Form } from './form.js';

const width = 200;
const d = 15;

function decodePosition(string) {
  const array = string.split(',');
  const x = parseFloat(array[0] || 0);
  const y = parseFloat(array[1] || 0);
  return { left: (x * width) - d, top: ((1.0 - y) * width) - d };
}

function encodePosition(id) {
  const e = document.getElementById(id);
  const x = (parseFloat(e.style.left || 0) + d) / width;
  const y = (parseFloat(e.style.top || 0) + d) / width;
  return `${x},${1.0 - y}`;
}

function limit(value, min, max) {
  const result = value;
  if (result < min) result = min;
  if (result > max) result = max;
  return result;
}

// //////////////////////////////////////////////////////////////

class TabletSettingsForm extends Form {
  constructor() {
    super();
    this.id = 'tablet-settings';
  }

  init() {
    return new Promise((resolve, reject) => {
      const buttons = {};
      buttons[T('Ok')] = () => { resolve(this.saveForm()); };
      buttons[T('Cancel')] = () => { resolve(); };

      const string = locale.translateHTML(`
        <div style="width:300px; height:250px; font-size:12px;">
          <div class="tablet-settings">
            <canvas id="tablet-curve" width="${width}px" height="${width}px" style="width:${width}px; height:${width}px; border: 1px solid black"></canvas>

            <div style="top:-10px; left:-205px; width: 200px; text-align:right;">100%</div>
            <div style="top:90px; left:-205px; width: 200px; text-align:right;">T(Output)</div>
            <div style="top:185px; left:-205px; width: 200px; text-align:right;">0%</div>

            <div style="left:0px; top:200px;">0%</div>
            <div style="left:95px; top:200px;">T(Pen pressure)</div>
            <div style="left:200px; top:200px;">100%</div>

            <div class="control-point" id="tablet-curve-left"><div></div></div>
            <div class="control-point" id="tablet-curve-right"><div></div></div>
            <div class="control-point" id="tablet-curve-center"><div></div></div>
          </div>
        </div>
        <input type='submit' style='display: none' />
        <button name='reset' class='ui-button'>T(Reset Settings to Default)</button>
      `);

      $(this.element).html(`<form id='${this.id}'>${string}</form>`);
      $(this.element).dialog({
        autoOpen: false,
        position: { my: 'center center', at: 'center center' },
        title: T('Tablet Settings'),
        modal: true,
        width: 360,
        buttons: buttons,
        open: function () {
          $(this).parent().find('button:nth-child(1)').focus();
        }
      });

      document.forms[this.id].reset.onclick = () => {
        this.resetSettings();
      };

      this.initForm();
    });
  }

  initForm() {
    $('#tablet-curve-left').draggable({
      axis: 'y',
      drag: function (event, ui) {
        ui.position.top = limit(ui.position.top, -d, width - d);
        this.updateCanvas();
      }.bind(this)
    });
    $('#tablet-curve-right').draggable({
      axis: 'y',
      drag: function (event, ui) {
        ui.position.top = limit(ui.position.top, -d, width - d);
        this.updateCanvas();
      }.bind(this)
    });
    $('#tablet-curve-center').draggable({
      drag: function (event, ui) {
        ui.position.top = limit(ui.position.top, -d, width - d);
        ui.position.left = limit(ui.position.left, -d, width - d);
        this.updateCanvas();
      }.bind(this)
    });

    const curveLeft = config.getValue('tabletCurveLeft');
    const curveRight = config.getValue('tabletCurveRight');
    const curveCenter = config.getValue('tabletCurveCenter');
    $('#tablet-curve-left').css(decodePosition(curveLeft));
    $('#tablet-curve-right').css(decodePosition(curveRight));
    $('#tablet-curve-center').css(decodePosition(curveCenter));
    this.updateCanvas();
  }


  updateCanvas() {
    const canvas = $('#tablet-curve')[0];
    const ctx = canvas.getContext('2d');

    const left = document.getElementById('tablet-curve-left');
    const right = document.getElementById('tablet-curve-right');
    const center = document.getElementById('tablet-curve-center');
    const x0 = parseFloat(left.style.left) + d;
    const y0 = parseFloat(left.style.top) + d;
    const x1 = parseFloat(center.style.left) + d;
    const y1 = parseFloat(center.style.top) + d;
    const x2 = parseFloat(right.style.left) + d;
    const y2 = parseFloat(right.style.top) + d;

    ctx.clearRect(0, 0, width, width);
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.strokeStyle = '#ccc';
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.moveTo(x0, y0);
    ctx.quadraticCurveTo(x1, y1, x2, y2);
    ctx.stroke();
  }

  saveForm() {
    const curveLeft = encodePosition('tablet-curve-left');
    const curveRight = encodePosition('tablet-curve-right');
    const curveCenter = encodePosition('tablet-curve-center');
    config.data.tabletCurveLeft = curveLeft;
    config.data.tabletCurveRight = curveRight;
    config.data.tabletCurveCenter = curveCenter;
    config.save();
  }

  resetSettings() {
    $('#tablet-curve-left').css(decodePosition('0,0'));
    $('#tablet-curve-right').css(decodePosition('1,1'));
    $('#tablet-curve-center').css(decodePosition('0.5,0.5'));
    setTimeout(this.updateCanvas, 100);
  }
}

export { TabletSettingsForm };
