'use strict'

import { Tool } from './tool.es6'
import { Project } from './project.es6'
import { Page } from './page.es6'
import { Controller } from './controller.es6'
import { Selection } from './selection.es6'
import { historyButton } from './history-button.es6'
import { Text } from './text.es6'

let _page, _pageX, _pageY, _moved, _node


class TextTool extends Tool {
  constructor() {
    super()
    this.name = 'text'
  }

  onDown(e, node) {
    nn.log('text onDown', Controller.shiftKey)
    _node = node
      
    const pid = Page.getPID(node)
    const project = Project.current

    if (!$(node).hasClass('selected')) {
      if (!Controller.shiftKey) {
	project.selection.clear()
      }
      project.selection.drop()
      project.selection.add(node)
    }

    project.selection.lift()
    project.selectPage(pid)
    _page = project.findPage(pid)

    if (!_page) {
      nn.log('_page error..', node.className, node.contentEditable,
		  node.innerHTML)
    }

    const pos = _page.positionFromEvent(e)
    _pageX = pos[0]
    _pageY = pos[1]
    _moved = false
  }

  onUp(e) {
    nn.log('text onUp', Controller.shiftKey)
    const project = Project.current
    const target = project.findPageFromEvent(e)

    //if (project.selection.pid != target.pid) {
    //  target.pushUndo({ type:'text', pid:selection.pid }) // pushUndo
    //}

    project.selection.drop(target)
    target.pushUndo({ type:'text', pid:target.pid }) // pushUndo
    historyButton.update()

    if (!_moved && !Controller.shiftKey) {
      project.selection.removeOthers(_node)

      $(_node).addClass("editable")
      //_node.contentEditable = true
      Text.setEditable(_node, true)

      project.selection.lift()
      _node.focus()
    }      
    Tool.pop()
  }

  onMove(e) {
    nn.log('text onMove', Controller.shiftKey)
    
    const pos = _page.positionFromEvent(e)
    const x = pos[0]
    const y = pos[1]
    const minMove = 5
    if (Math.abs(_pageX - x) >= minMove || Math.abs(_pageY - y) >= minMove) {
      _moved = true
    }

    if (_moved) {
      if (_pageX != x || _pageY != y) {
	const project = Project.current
	project.selection.onDrag(_pageX - x, _pageY - y)
	_pageX = x
	_pageY = y
      }
    }
  }
}


export { TextTool }
