'use strict'

import { Menu } from './menu.es6'


class TextBuffer {}

TextBuffer.init = () => {
  TextBuffer.clear()
}


TextBuffer.push = (element) => {
  if (TextBuffer.pasted) TextBuffer.clear()

  TextBuffer.list.push(element)
  Menu.update()
}

TextBuffer.hasText = () => {
  return (TextBuffer.list.length > 0) ? true : false
}

TextBuffer.clear = () => {
  TextBuffer.list = []
  TextBuffer.pasted = false
  $('#text-buffer')[0].innerHTML = ''
  Menu.update()
}

TextBuffer.clearClipboard = () => {
  const clipboard = $('#clipboard')[0]
  clipboard.disabled = false
  clipboard.select();
  const result = document.execCommand('copy')
  clipboard.disabled = true
}

TextBuffer.list = []
TextBuffer.pasted = false


export { TextBuffer }
