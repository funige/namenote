'use strict'

import { bookmarkDefault } from './bookmark-default.es6'


const bookmark = {
  list: [],
  current: null,
}


export { bookmark }



/*  
  load: () => {
    const json = localStorage.getItem('namenote/bookmark')
    bookmark.list = (json) ? JSON.parse(json) : []
  },

  save: () => {
    const json = JSON.stringify(bookmark.list)
    localStorage.setItem('namenote/bookmark', json)
  },

  select: (item) => {
    bookmark.current = item
    
  },

  reset: () => {
    bookmark.list = []
    bookmark.save()
  },

  findIndex: (url) => {
    for (let i = 0; i < bookmark.list.length; i++) {
      if (bookmark.list[i].url === url) {
	return i;
      }
    }
    return -1
  },
  
  find :(url) => {
    const index = bookmark.findIndex()
    return (index >= 0) ? bookmark.list[i] : null
  },
*/
