'use strict'

import { locale } from './locale.es6'
import { namenote } from './namenote.es6'
import { App } from './app.es6'

namenote.isTrial = false
namenote.isApp = true
namenote.app = App

  
////////////////////////////////////////////////////////////////

window.namenote = window.nn = namenote
window.T = locale.translate


