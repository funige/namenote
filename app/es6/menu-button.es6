'use strict'

import { Menu } from './menu.es6'
import { View } from './view.es6'
import { Tool } from './tool.es6'
import { locale } from './locale.es6'
import { config } from './config.es6'
import { command } from './command.es6'
import { menuTemplate, fileMenuTemplate, otherMenuTemplate } from './menu-template.es6'


function closeMenu(menu) {
  menu.menu("collapseAll", null, true)
  setTimeout(function() {
    Tool.hideDropdown()

    const id = menu[0].id.replace(/-menu/, '')
    $('#' + id + '-button').imgButton('locked', false)
  }, 500)
}

////////////////////////////////////////////////////////////////

const menuButton = {}

const blurDelay = 500
let menuTimer
let fileTimer

menuButton.init = () => {
  menuButton.initFileButton()
  menuButton.initMenuButton()
}

menuButton.initFileButton = () => {
  const fileDropdown = `
      <div id="file-dropdown" class="dropdown-content">
        <ul id="file-menu">
        </ul>
      </div>`
  
  const fileButton = $('#file-button').imgButton({
    src: 'img/flip-button.png',
    float: 'left',
    click: function(e) {
      const element = $(e.target)
      if (!element.imgButton('disabled')) {
	element.imgButton('locked', !element.imgButton('locked'))
      }
      Tool.toggleDropdown(e, 'file')
    },
    html: Menu.getMenuHTML(fileMenuTemplate, 'file')
  })[0]

  const fileMenu = $("#file-menu")
  fileMenu.menu({
    position: {
      my: 'left top',
      at: 'right top'
    },
    select: function (event, ui) {
      if (Menu.onselect(event, ui)) {
        fileMenu.menu('blur')
      }
    },
  })
  
  $('#file-menu .ui-icon').hide()

  fileMenu.on('menufocus', function() {
    clearTimeout(fileTimer)
  })
  fileMenu.on('menublur', function() {
    fileTimer = setTimeout(function() {
      closeMenu(fileMenu)
    }, blurDelay)
  })
}

menuButton.initMenuButton = () => {
  const menuDropdown = `
      <div id="menu-dropdown" class="dropdown-content">
        <ul id="menu-menu">
        </ul>
      </div>`
  
  const menuButton = $('#menu-button').imgButton({
    src: 'img/menu-button.png',
    float: 'right',
    click: function(e) {
      const element = $(e.target)
      if (!element.imgButton('disabled')) {
	element.imgButton('locked', !element.imgButton('locked'))
      }
      Tool.toggleDropdown(e, 'menu')
    },
    html: Menu.getMenuHTML(otherMenuTemplate, 'menu')
  })[0]

  const menuMenu = $('#menu-menu')
  menuMenu.menu({
    position: {
      my: 'right top',
      at: 'left top'
    },
    select: function (event, ui) {
      if (Menu.onselect(event, ui)) {
        menuMenu.menu('blur')
      }
    },
  })

  $('#menu-menu .ui-icon').hide()

  menuMenu.on('menufocus', function() {
    clearTimeout(menuTimer)
  })
  menuMenu.on('menublur', function() {
    menuTimer = setTimeout(function() {
      closeMenu(menuMenu)
    }, blurDelay)
  })
}

menuButton.onresize = () => {
  const width = View.width()

  if (width) {
    $('#menu-dropdown').css('left', width - 150 + 8)
  }
}

menuButton.update = () => {
}

export { menuButton }

/*
  const fileDropdown = `
      <div id="file-dropdown" class="dropdown-content">
        <ul id="file-menu">
          <li class="ui-state-disabled"><div>Toys (n/a)</div></li>
          <li><div>Books</div></li>
          <li><div>Clothing</div></li>
          <li><div><p style="text-align:left; float:left;">Electronics</span>
                   <p style="text-align:right;">^H</span></div><ul>
              <li class="ui-state-disabled"><div>Home Entertainment</div></li>
              <li><div>Car Hifi</div></li>
              <li><div>Utilities</div></li>
            </ul>
          </li>
          <li><div>Movies</div></li>
          <li><div>Music</div>
            <ul>
              <li><div>Rock</div>
                <ul>
                  <li><div>Alternative</div></li>
                  <li><div>Classic</div></li>
                </ul>
              </li>
              <li><div>Jazz</div>
                <ul>
                  <li><div>Freejazz</div></li>
                  <li><div>Big Band</div></li>
                  <li><div>Modern</div></li>
                </ul>
              </li>
              <li><div>Pop</div></li>
            </ul>
          </li>
          <li class="ui-state-disabled"><div>Specials (n/a)</div></li>
        </ul>
      </div>`
*/
