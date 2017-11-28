'use strict'


const locale = {
  translate: (string) => string,

  translateHTML: (html) => {
    return html.replace(/T\((.*?)\)/g, (all, match) => {
      return T(match)
    })
  },
  
  init: () => {
    const dictionary = require('../js/lib/dictionary.js').dictionary
    
    for (let key in dictionary) {
      if (navigator.language.indexOf(key) == 0) {
	locale.translate = (string) => dictionary[key][string] || string
	return
      }
    }
  },
}


export { locale }
