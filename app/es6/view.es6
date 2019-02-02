'use strict'

////////////////////////////////////////////////////////////////

class View {
  constructor(element) {
    this.element = element
    this.preventScrollFreeze()
  }

  preventScrollFreeze() {
    this.lastX = 0
    this.lastY = 0

    const scroller = $(this.element).parent()
    scroller.on('touchstart', function(e) {
      this.lastX = e.touches[0].clientX
      this.lastY = e.touches[0].clientY
    }.bind(this))
    
    scroller.on('touchmove', function(e) {
      const x = e.touches[0].clientX
      const y = e.touches[0].clientY

      const width = this.element.offsetWidth
      const height = this.element.offsetHeight

      const scrollTop = $(e.currentTarget).scrollTop()
      const scrollLeft = $(e.currentTarget).scrollLeft()
      const dirY = (this.lastY - y) < 0 ? 'up': 'down'
      const dirX = (this.lastX - x) < 0 ? 'left': 'right'

      if (scrollTop === 0) {
        if (dirY === "up") e.preventDefault();

      } else if (scrollTop >= e.currentTarget.scrollHeight - height) {
        if (dirY === "down") e.preventDefault();
      }
      if (scrollLeft === 0) {
        if (dirX === "left") e.preventDefault();

      } else if (scrollLeft >= e.currentTarget.scrollWidth - width) {
        if (dirX === "right") e.preventDefault();
      }
      this.lastX = x;
      this.lastY = y;
    }.bind(this))
  }
}

export { View }
