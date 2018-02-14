'use strict'

import { Tool } from './tool.es6'
import { locale } from './locale.es6'
import { config } from './config.es6'
import { command } from './command.es6'

const buttons = []


const toolButton = {}

toolButton.init = () => {
  toolButton.initPenButton()
  toolButton.initEraserButton()
  toolButton.initTextButton()

  toolButton.initForm()
}

toolButton.initPenButton = () => {
  const penDropdown = `
      <div id="pen-dropdown" class="dropdown-content">
        <form name="pen-form" class="dropdown-form" title="">
          <label><input type='radio' name='size' value=0 />T(S)</label>
          <label><input type='radio' name='size' value=1 />T(M)</label>
          <label><input type='radio' name='size' value=2 />T(L)</label>

          &nbsp;&nbsp;
          <label><input type='checkbox' name='pressure' />&nbsp;T(Pressure)</label>
        </form>
      </div>`

  const penButton = $('#pen-button').imgButton({
    src: 'img/pen-button.png',
    locked: true,
    float: 'left',
    click: function(e) {
      command.pen(e)
    },
    html: locale.translateHTML(penDropdown)
  })[0]
  buttons.push(penButton)
  $('#pen-dropdown').css('left', $('#pen-button').position().left)
}

toolButton.initEraserButton = () => {
  const eraserDropdown = `
      <div id="eraser-dropdown" class="dropdown-content">
        <form name="eraser-form" class="dropdown-form" title="">
          <label><input type='radio' name='size' value=0 />T(S)</label>
          <label><input type='radio' name='size' value=1 />T(M)</label>
          <label><input type='radio' name='size' value=2 />T(L)</label>

          &nbsp;&nbsp;
          <label><input type='checkbox' name='pressure' />&nbsp;T(Pressure)</label>
        </form>
      </div>`

  const eraserButton = $('#eraser-button').imgButton({
    src: 'img/eraser-button.png',
    float: 'left',
    click: function(e) {
      command.eraser(e)
    },
    html: locale.translateHTML(eraserDropdown)
  })[0]
  buttons.push(eraserButton)
  $('#eraser-dropdown').css('left', $('#eraser-button').position().left)
}
toolButton.initTextButton = () => {
  const textDropdown = `
      <div id="arrow-dropdown" class="dropdown-content">
        <form name = "arrow-form" class="dropdown-form" title="">
          <select name='size'>
            <option>8
            <option>9
            <option>10
            <option>11
            <option>12
            <option>14
            <option>16
            <option>18
            <option>24
            <option>36
            <option>48
            <option>64
            <option>72
          </select>&nbsp;

          &nbsp;&nbsp;
          <label><input type='radio' name='vert' value=0 />T(Horizontal)</label>
          <label><input type='radio' name='vert' value=1 />T(Vertical)</label>
          <br/>
        </form>
      </div>`

  const textButton = $('#arrow-button').imgButton({
    src: 'img/text-button.png',
    float: 'left',
    click: function(e) {
      command.text(e)
    },
    html: locale.translateHTML(textDropdown)
  })[0]
  buttons.push(textButton)
  $('#arrow-dropdown').css('left', $('#arrow-button').position().left)
}

toolButton.update = (name) => {
  for (const button of buttons) {
    const locked = (button.id == name + '-button') ? true : false
    $(button).imgButton('locked', locked)
  }
}

toolButton.penSizeChanged = () => {
  const value = document['pen-form'].size.value
  nn.log('pen size changed', value)
  config.data.penSize = value
  config.save()
}
toolButton.penPressureChanged = () => {
  const value = document['pen-form'].pressure.checked
  nn.log('pen pressure changed', value)
  config.data.penPressure = value
  config.save()
}

toolButton.eraserSizeChanged = () => {
  const value = document['eraser-form'].size.value
  nn.log('eraser size changed', value)
  config.data.eraserSize = value
  config.save()
}
toolButton.eraserPressureChanged = () => {
  const value = document['eraser-form'].pressure.checked
  nn.log('eraser pressure changed', value)
  config.data.eraserPressure = value
  config.save()
}
toolButton.textSizeChanged = () => {
  const value = document['arrow-form'].size.value
  nn.log('text size changed', value)
  config.data.textSize = parseInt(value)
  config.save()
}
toolButton.textDirectionChanged = () => {
  const value = (document['arrow-form'].vert.value != 0) ? true : false
  nn.log('text direction changed', value)
  config.data.textDirection = value
  config.save()
}

toolButton.initForm = () => {
  document['pen-form'].size.value = config.getValue('penSize', 0)
  document['pen-form'].size[0].onchange = toolButton.penSizeChanged
  document['pen-form'].size[1].onchange = toolButton.penSizeChanged
  document['pen-form'].size[2].onchange = toolButton.penSizeChanged
  document['pen-form'].pressure.checked = config.getValue('penPressure', true)
  document['pen-form'].pressure.onchange = toolButton.penPressureChanged

  document['eraser-form'].size.value = config.getValue('eraserSize', 0)
  document['eraser-form'].size[0].onchange = toolButton.eraserSizeChanged
  document['eraser-form'].size[1].onchange = toolButton.eraserSizeChanged
  document['eraser-form'].size[2].onchange = toolButton.eraserSizeChanged
  document['eraser-form'].pressure.checked = config.getValue('eraserPressure', true)
  document['eraser-form'].pressure.onchange = toolButton.eraserPressureChanged

  document['arrow-form'].size.value = config.getValue('textSize', 14)
  document['arrow-form'].size.onchange = toolButton.textSizeChanged
  document['arrow-form'].vert.value = config.getValue('textDirection', true) ? 1 : 0
  document['arrow-form'].vert[0].onchange = toolButton.textDirectionChanged
  document['arrow-form'].vert[1].onchange = toolButton.textDirectionChanged

  /*
  document['arrow-form'].size.onclick = function(e) {
    const target = e.target
    console.warn('[select]', target.innerHTML)

    const offset = $(this).offset()
    console.warn('offset', e.pageX - offset.left, e.pageY - offset.top)

//  const rect = target.getBoundingClientRect()
//  console.warn(target)
//  console.warn(rect.left, rect.top, rect.width, rect.height)
  }
  */
}

export { toolButton }
