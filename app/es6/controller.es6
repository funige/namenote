'use strict'

import { Project } from './project.es6'
import { View } from './view.es6'
import { Tool } from './tool.es6'
import { Page } from './page.es6'
import { Selection } from './selection.es6'

let onStroke = false
let pid = null

//let altKey = false
//let ctrlKey = false
//let shiftKey = false
//let spaceKey = false

let x0 = 0
let y0 = 0
let moved = false

class Controller {}

Controller.init = () => {
  const api= (window.PointerEvent) ? 'pointer' : ((window.TouchEvent) ? 'touch' : 'mouse')
  nn.log(`use ${api} api`)
  
  window.addEventListener(api + 'down', (e) => {
    x0 = (e.clientX !== undefined) ? e.clientX : e.touched[0].clientX
    y0 = (e.clientY !== undefined) ? e.clientY : e.touched[0].clientY
    Controller.onDown(e)
  })

  window.addEventListener(api + 'up', (e) => {
    Controller.onUp(e)
  })
    
  window.addEventListener(api + 'move', (e) => {
    const x = (e.clientX !== undefined) ? e.clientX : e.touched[0].clientX
    const y = (e.clientY !== undefined) ? e.clientY : e.touched[0].clientY
    const minMove = 5
    if (Math.abs(x - x0) >= minMove || Math.abs(y - y0) >= minMove) {
      moved = true
    }
    Controller.onMove(e)
  })

/* 
  window.addEventListener('click', (e) => {
    if (!e.target.matches('.dropbtn')) {
      const dropdowns = document.getElementsByClassName("dropdown-content");
      for (const openDropdown of dropdowns) {
	if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
	}
      }
    }    
  })
*/
  
  document.addEventListener('keydown', (e) => {
    Controller.altKey = e.altKey
    Controller.ctrlKey = e.ctrlKey
    Controller.shiftKey = e.shiftKey
    if (e.keyCode == 32) Controller.spaceKey = true
  })

  document.addEventListener('keyup', (e) => {
    Controller.altKey = e.altKey
    Controller.ctrlKey = e.ctrlKey
    Controller.shiftKey = e.shiftKey
    if (e.keyCode == 32) Controller.spaceKey = false
  })


  document.addEventListener('cut', (e) => {
    const data = e.clipboardData.getData('text/plain').replace(/\r\n/g, '\n')
    const project = Project.current
    if (project && namenote.app) {
      project.cut(data)
    }
  })
  
  document.addEventListener('copy', (e) => {
    const data = e.clipboardData.getData('text/plain').replace(/\r\n/g, '\n')
    const project = Project.current
    if (project && namenote.app) {
      project.copy(data)
    }
  })
  
  document.addEventListener('paste', (e) => {
    const data = e.clipboardData.getData('text/plain').replace(/\r\n/g, '\n')
    const project = Project.current
    if (project && namenote.app) {
      project.paste(data)
    }
  })
}

Controller.onDown = (e) => {
  nn.log("on down")
  Controller.x = (e.clientX !== undefined) ? e.clientX : e.touches[0].clientX
  Controller.y = (e.clientY !== undefined) ? e.clientY : e.touches[0].clientY

  const project = Project.current
  if (!project) return

  let node = e.target
  while (node) {
    //nn.log(`....${node.tagName}-${node.className}(${node.id})`)

    if (node.classList && node.classList.contains('text')) {
      if ($(node).hasClass('editable')) {
	nn.log("*contentEditable")
	return
      }

      Tool.push('text')
      Tool.current.onDown(e, node)
      onStroke = true
      return
    }

    if (node.classList && node.classList.contains('page')) {
      pid = Page.getPID(node)

      if (Controller.spaceKey || !project.findPageFromEvent(e)) {
	Tool.push('hand')

      } else {
	project.selectPage(pid)
	project.selection.clear()
      }

      if (Controller.ctrlKey) {
	Tool.push('arrow')
      }
      
      Tool.current.onDown(e, pid)
      nn.log('*page', pid)
      onStroke = true
      return 
    }

    if (node.id == 'tool-bar') {
      return
    }
    
    if (node.className == 'root' && !Controller.ctrlKey && !Controller.shiftKey) {
      Tool.push('hand')
      Tool.current.onDown(e, null)
      onStroke = true
      return
    }
    
    node = node.parentNode
  }
}

Controller.onUp = (e) => {
  Controller.x = (e.clientX !== undefined) ? e.clientX : e.touches[0].clientX
  Controller.y = (e.clientY !== undefined) ? e.clientY : e.touches[0].clientY
  if (onStroke) {
    Tool.current.onUp(e)
    onStroke = false
    pid = null
  }
  //return false
}

Controller.onMove = (e) => {
  Controller.x = (e.clientX !== undefined) ? e.clientX : e.touches[0].clientX
  Controller.y = (e.clientY !== undefined) ? e.clientY : e.touches[0].clientY
  if (onStroke) {
    Tool.current.onMove(e)
  }
  //return false
}

Controller.getPID = (node) => {
  while (node) {
    if (node.classList && node.classList.contains('page')) {
      return parseInt(node.id.split('-')[1])
    }
    node = node.parentNode
  }
  return null
}

Controller.isMoved = () => {
  return moved
}

Controller.clearMove = () => {
  if (!Controller.spaceKey) moved = false
}

Controller.rawPositionFromEvent = (e) => {
  const x = (!e) ? Controller.x :
	(e.clientX !== undefined) ? e.clientX : e.touches[0].clientX
  const y = (!e) ? Controller.y :
	(e.clientY !== undefined) ? e.clientY : e.touches[0].clientY
  return [ x, y ]
}


export { Controller }
