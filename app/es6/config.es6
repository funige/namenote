'use strict'

import { configDefault } from './config-default.es6'


const config = {
  data: [],

  load: () => {
    const json = localStorage.getItem('namenote/config')
    config.data = (json) ? JSON.parse(json) : $.extend(true, {}, configDefault)
  },

  save: () => {
    const json = JSON.stringify(config.data)
    localStorage.setItem('namenote/config', json)
  },

  reset: () => {
    config.data = Object.assign({}, configDefault)
    config.save()
  },

  getValue: (key, defaultValue) => {
    if (config.data[key] !== undefined) {
      return config.data[key]

    } else {
      return defaultValue
    }
  },

  ////////////////////////////////////////////////////////////////
  
  getZoomFont: () => {
    return config.getValue('zoomFont', true)
  },
  getZoomFontSize: () => {
    return config.getValue('zoomFontSize', 10)
  },
  
  getQuickline: () => {
    return config.getValue('quickline', true)
  },
  getQuicklineDelay: () => {
    return config.getValue('quicklineDelay', 0.5)
  }
}


export { config }
