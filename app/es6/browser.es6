'use strict'

import { namenote } from './namenote.es6'
import { locale } from './locale.es6'


window.namenote = namenote

window.T = locale.translate
window.log = console.log.bind(window.console)
window.warn = console.warn.bind(window.console)
window.error = console.error.bind(window.console)

document.addEventListener("DOMContentLoaded", function(){
  namenote.init()
})





