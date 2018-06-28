'use strict'

const locale = {
  translate: (string) => {
    return locale.truncate(string)
  },

  translateHTML: (html) => {
    return html.replace(/T\((.*?)\)/g, (all, match) => {
      return T(match)
    })
  },

  init: () => {
    const dictionary = require('../js/lib/dictionary.js').dictionary
    
    for (let key in dictionary) {
      if (navigator.language.indexOf(key) == 0) {
	locale.translate = (string) => {
          return locale.truncate(dictionary[key][string] || string)
        }
      }
    }
  },

  truncate: (string, length) => {
    if (length && string.length > 3) {
      string = "..." + string.slice(length - 3)
    }
    return string
  },
}


export { locale }
