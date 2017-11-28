'use strict'

import { locale } from './locale.es6'
import { namenote } from './namenote.es6'

namenote.isApp = false
namenote.app = undefined

////////////////////////////////////////////////////////////////

window.namenote = window.nn = namenote
window.T = locale.translate

