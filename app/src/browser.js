import { namenote } from './namenote.js'
import { locale } from './locale.js'

window.namenote = namenote
window.T = locale.translate
window.PX = (x) => x + 'px'

window.LOG = console.log.bind(window.console)
window.WARN = console.warn.bind(window.console)
window.ERROR = console.error.bind(window.console)

document.addEventListener("DOMContentLoaded", function() {
  namenote.init()
})

/*
////////////////////////////////
// test

import bar from './bar'

import {config, dom, library} from '@fortawesome/fontawesome-svg-core'
import {faDog} from '@fortawesome/free-solid-svg-icons/faDog'
import {faCat} from '@fortawesome/free-solid-svg-icons/faCat'
import {faComments} from '@fortawesome/free-regular-svg-icons/faComments'

library.add(faDog,faComments, faCat)
dom.i2svg()
bar()
*/
