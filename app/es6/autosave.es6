'use strict'

import { Project } from './project.es6'
import { Page } from './page.es6'
import { debug } from './debug.es6'

const worker = new Worker('./js/lib/worker.js')
const defaultInterval = 10

class Autosave {}


Autosave.STATUS = {
  NONE: 0,
  IDLE: 1,
  BUSY: 2,
  ERROR: 3,
  DISABLED: 4,
}

Autosave.status = Autosave.STATUS.NONE
Autosave.list = []

////////////////////////////////////////////////////////////////

Autosave.init = () => {
  Autosave.update()
  Autosave.status = Autosave.STATUS.IDLE

  worker.onmessage = (e) => {
    nn.log(`*saved ${e.data.pid}`)
    Autosave.updateIndicator()
    
    if (!e.data.err) {
      const project = Project.find(e.data.url)
      if (project) {
	const page = project.findPage(e.data.pid)
	if (page) {
	  page.params.base64 = e.data.base64
	  if (namenote.app) {
	    namenote.app.savePage(project, page, (err) => {
	      if (err) nn.log(err)
	    })
	  }
	}
      }
      /*
      Autosave.status = (Autosave.list.length > 0) ? 
	Autosave.STATUS.IDLE : Autosave.STATUS.BUSY
      */
    } else {
      nn.log(e.data.err)
      Autosave.status = Autosave.STATUS.ERROR
    }

  }
  
/*
    const data = e.data
    if (!data.err) {
	  
	  if (Autosave.list.length <= 0) {
	    if (Autosave.list.length > 0) {
	      Autosave.status = Autosave.STATUS.BUSY
	    } else {
	      Autosave.status = Autosave.STATUS.IDLE
	    }
	  }
	  return  
	}
      }
    }
    nn.log(`Autosave Error url=${data.url}, pid=${data.pid}...${err}`)
    Autosave.status = Autosave.STATUS.ERROR
*/

}

Autosave.update = () => {
  Autosave.assertPage()
  debug.updateMemoryUsage()

  if (Autosave.status == Autosave.STATUS.DISABLED) return
  
  if (Autosave.list.length > 0) {
    try {
      const item = Autosave.list.pop()
      Autosave.save(item, (err) => {
	if (!err) {
	  const target = item.target
	  if (item.target.released) target.destructor()
	  
	} else nn.log('!!!', err)
      })
    } catch (e) {
      nn.log(e)
    }
  }

  setTimeout(() => {
    Autosave.update()
  }, (Autosave.list.length > 0) ? 0 : defaultInterval * 1000)
}

Autosave.updateIndicator = () => {
  if (Autosave.list.length > 0) {
    $('#save-indicator').show()

  } else {
    $('#save-indicator').hide()
  }
}

Autosave.pushPage = (page, textOnly) => {
  page.dirty = true
  return Autosave.push({ type:'page', target:page, textOnly: textOnly })
}

Autosave.pushProject = (project) => {
  project.dirty = true
  return Autosave.push({ type:'project', target:project })
}

Autosave.push = (item) => {
  for (let i = 0; i < Autosave.list.length; i++) {
    if (Autosave.list[i].target === item.target) return false
  }
  Autosave.list.unshift(item)
  Autosave.updateIndicator()
  return true
}

Autosave.save = (item, callback) => {
  if (item.type == 'page') {
    if (item.textOnly) {
      Autosave.savePageTextOnly(item.target, callback)
    } else {
      Autosave.savePage(item.target, callback)
    }
  } else {
    Autosave.saveProject(item.target, callback)
  }
}

Autosave.savePage = (page, callback) => {
  if (!page) return
  const width = page.canvas.width
  const height = page.canvas.height
  const imageData = page.ctx.getImageData(0, 0, width, height)
  worker.postMessage({ type:'page',
		       url: page.project.url,
		       pid: page.pid,
		       imageData:imageData })
}

Autosave.savePageTextOnly = (page, callback) => {
  /*if (!page) return
  const width = page.canvas.width
  const height = page.canvas.height
  const imageData = page.ctx.getImageData(0, 0, width, height)
  worker.postMessage({ type:'page', imageData:imageData })*/
}

Autosave.saveProject = (project) => {
  if (namenote.app) {
    namenote.app.saveProject(project, (err) => {
      if (!err) {
	nn.log('*saveProject*')
	Autosave.updateIndicator()
	
	project.dirty = false
      }
    })
  }
}

// テキストのセーブ漏れを確認する
Autosave.assertPage = () => {
  //nn.log('...')

  const project = Project.current
  if (!project) return
  const page = project.currentPage
  if (!page) return
  const texts = page.texts.innerHTML
  
  //throw new Error('セーブ漏れ監視中')
}

export { Autosave }
