import { namenote } from './namenote.js'
import { locale } from './locale.js'
import { app } from './app.js'


window.namenote = namenote
window.T = locale.translate
window.PX = (x) => x + 'px'

window.LOG = console.log.bind(window.console)
window.WARN = console.warn.bind(window.console)
window.ERROR = console.error.bind(window.console)

document.addEventListener("DOMContentLoaded", function(){
  namenote.app = app
  namenote.init()
})


