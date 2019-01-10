'use strict'

class Widget {
  constructor() {
    this.initImgButton()
  }

  initImgButton() {
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

        if (this.options.content) {
          this.element[0].appendChild(this.options.content)
          const content = this.options.content
          
          content.title = ""
          if (this.options.float == 'right') {
            content.style.right = "0"
          }
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
}

const widget = new Widget()

export { widget }
