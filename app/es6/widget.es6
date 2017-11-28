'use strict'

import { command } from './command.es6'
import { Project } from './project.es6'
import { Tool } from './tool.es6'


const widget = {
  init: () => {
    initImgButton();
    initMenuButton();
  },
}


function initImgButton() {
  $.widget('namenote.imgButton', {
    options: {
      float: 'left',
      width: '24px',
      height: '24px',
      locked: false,
      disabled: false,
    },
  
    _create: function() {
      this.element.addClass('img-button')
      this.element.css('background-image', `url(${this.options.src})`)

      this.element.css('float', this.options.float)
      this.element.css('width', this.options.width)
      this.element.css('height', this.options.height)
      this.locked(this.options.locked)
      this.disabled(this.options.disabled)

      if (this.options.html) {
	this.element.html(this.options.html)
      }

      const click = this.options.click
      if (click) this.element.on('click', click)
},

    locked: function(value) {
      if (value === undefined) return this.options.locked

      this.options.locked = value
      if (value) {
	this.element.addClass('locked')
      } else {
	this.element.removeClass('locked')
      }
    },

    disabled: function(value) {
      if (value === undefined) return this.options.disabled
      
      this.options.disabled = value
      if (value) {
	this.element.addClass('off')
      } else {
	this.element.removeClass('off')
      }
    },
  })
}

function initMenuButton() {
  $.widget('namenote.menuButton', {
    options: {
      float: 'left',
      width: '24px',
      height: '24px',
      locked: false,
    },
  
    _create: function() {
      this.element.addClass('img-button')
      this.element.css('background-image', `url(${this.options.src})`)

      this.element.css('float', this.options.float)
      this.element.css('width', this.options.width)
      this.element.css('height', this.options.height)
      this.locked(this.options.locked)

      const click = this.options.click
      if (click) this.element.on('click', click)
},

    locked: function(value) {
      if (value === undefined) return this.options.locked

      this.options.locked = value
      if (value) {
	this.element.addClass('locked')
      } else {
	this.element.removeClass('locked')
      }
    },
  })
}


export { widget }
