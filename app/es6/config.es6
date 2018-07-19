'use strict'

import { configDefault } from './config-default.es6'


const pressureTableSize = 25

////////////////////////////////////////////////////////////////

const config = {
  data: [],
  pressureTable: null,
  
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
  },

  getPressure: (x) => {
    let index = parseInt(x * pressureTableSize)
    if (index < 0) index = 0
    if (index >= pressureTableSize) index = pressureTableSize - 1
    
    if (!config.pressureTable) {
      config.precalculatePressure()
    }
    return config.pressureTable[index]
  },

  precalculatePressure: () => {
    const result = []
    const left = config.getValue('tabletCurveLeft', '0,0').split(',')
    const right = config.getValue('tabletCurveRight', '1,1').split(',')
    const center = config.getValue('tabletCurveCenter', '0.5,0.5').split(',')

    const x0 = parseFloat(left[0] || 0)
    const y0 = parseFloat(left[1] || 0)
    const x1 = parseFloat(center[0] || 0)
    const y1 = parseFloat(center[1] || 0)
    const x2 = parseFloat(right[0] || 0)
    const y2 = parseFloat(right[1] || 0)

    for (let t = 0; t < 100; t++) {
      const k = t / 100.0
      const k0 = (1.0 - k) * (1.0 - k)
      const k1 = (1.0 - k) * k * 2.0
      const k2 = k * k
      const x = k0 * x0 + k1 * x1 + k2 * x2
      const y = k0 * y0 + k1 * y1 + k2 * y2
    
      let index = parseInt(x * pressureTableSize)
      if (index < 0) index = 0
      if (index >= pressureTableSize) index = pressureTableSize - 1
      result[index] = y
    }

    config.pressureTable = result
  },
}


export { config }
