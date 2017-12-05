'use strict'

const debug = {}

debug.enabled = false

debug.init = () => {
  if (namenote.version.match(/debug/)) {
    debug.enabled = true
  }
}

debug.updateMemoryUsage = () => {
  if (!debug.enabled) return
  
  const memory = console.memory
  if (memory) {
    const total = (memory.totalJSHeapSize / 1000000).toFixed(2) + 'M'
    const used = (memory.usedJSHeapSize / 1000000).toFixed(2) + 'M'
    const limit = (memory.jsHeapSizeLimit / 1000000).toFixed(2) + 'M'
    $('#memory-usage').html(`${total} ${used} (${limit})`)
  }
}


export { debug }
