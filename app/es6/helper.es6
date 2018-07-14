'use strict'


const helper = {
  setDPI: (dpi) => {
    helper.dpi = dpi
  },

  topx: (mm) => {
    if (typeof mm === "number") {
      return Math.round(mm * (helper.dpi / 25.4))
    } else {
      return mm.map((x) => Math.round(x * (helper.dpi / 25.4)))
    }
  },

  tomm: (px) => {
    if (typeof px === "number") {
      return Math.round(px * (25.4 / helper.dpi))
    } else {
      return px.map((x) => Math.round(x * (25.4 / helper.dpi)))
    }
  },

  scale: (px, s) => {
    if (typeof px === "number") {
      return Math.round(px * s)
    } else {
      return px.map((x) => Math.round(x * s))
    }
  },
  
  toBase64: (buffer) => {
    return btoa(String.fromCharCode.apply(null, buffer))
  },

  toByteArray: (string) => {
    const array = new Uint8Array(string.length)
    for (let i = 0, il = string.length; i < il; i++) {
        array[i] = string.charCodeAt(i) & 0xff
    }
    return array
  },

  findDuplicateIds: () => {
    const ids = {}
    const all = document.all || document.getElementsByTagName("*")
    let duplicate = false
    
    for (let i = 0, l = all.length; i < l; i++) {
      const id = all[i].id
      if (id) {
        if (ids[id]) {
          nn.log('duplicate id: #' + id)
	  duplicate = true
        } else {
          ids[id] = 1
        }
      }
    }
    if (!duplicate) nn.log('no duplicate ids!')
  },

  addRule: (selector, styleName, value) => {
    var sheet = document.styleSheets[0]
    sheet.addRule(selector, styleName + ":" + value, sheet.rules.length)
  },

  intersectRect: (r1, r2) => {
    console.log(r1, r2)
    
    return !(r2[0] > (r1[0] + r1[2]) || 
             (r2[0] + r2[2]) < r1[0] ||
             r2[1] > (r1[1] + r1[3]) ||
             (r2[1] + r2[3]) < r1[1])
  },

  parseRegex: (regex) => {
    return regex
  },

  truncate: (string, length) => {
    const root = $('.root')[0]
    const div = document.createElement('div')
    root.appendChild(div)
    div.innerHTML = 'test'
    nn.warn('test..', div.offsetWidth)
    div.innerHTML = 'testtest'
    nn.warn('testtest...', div.offsetWidth)
    root.removeChild(div)
  },

  isMac: () => {
    return (window.process.platform == "darwin") ? true : false
  },

  limit: (value, min, max) => {
    if (value < min) value = min
    if (value > max) value = max
    return value
  },
  
  /*
  hasWintab: () => {
    return typeof _hasWintab != "undefined"
  },
  */
}


export { helper }
