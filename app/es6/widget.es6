'use strict'

class Widget {
  constructor() {
    this.initImageButton()
    this.initTextButton()
  }

  initTextButton() {
    $.widget('namenote.textButton', {
      options: {
        float: 'left',
        height: '24px',
        locked: false,
      },

      _create: function() {
        this.element.addClass('text-button')
        this.element.css('float', this.options.float)
        this.locked(this.options.locked)
        this.element.text(this.options.text)

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
  
  initImageButton() {
    $.widget('namenote.imageButton', {
      options: {
        float: 'left',
        width: '28px',
        height: '28px',
        locked: false,
        disabled: false,
      },
  
      _create: function() {
        this.element.addClass('img-button')
//      this.element.css('background-image', `url(${this.options.src})`)
//      this.element.css('background', '#eeffdd')
        this.element.css('float', this.options.float)
        this.element.css('width', this.options.width)
        this.element.css('height', this.options.height)

        this.element.attr('title', T(this.element.attr('title')))

        this.element.html(`<img src='${this.options.src}' />`)
//      WARN(this.element.html())
        
        this.locked(this.options.locked)
        this.disabled(this.options.disabled)
        
        if (this.options.content) {
          const content = this.options.content
          content.title = ""
          if (this.options.float == 'right') {
            content.style.right = "0"
          }
          const parent = this.options.contentParent || this.element[0]
          parent.appendChild(content)
          
          if (this.options.contentParent) {
            // Should recalc menu postion on open
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

      updateContentPosition: function() {
        const rect = this.element[0].getBoundingClientRect()
        const content = this.options.content
        const contentWidth = this.options.contentWidth || 150

        const width = document.body.clientWidth
        const left = (rect.x + contentWidth) < width ? rect.x : width - contentWidth
        content.style.left = (left - 2) + 'px'
        content.style.top = (64 + 2) + 'px'
      },
    })
  }
}

const widget = new Widget()

export { widget }
