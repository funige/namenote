// //////////////////////////////////////////////////////////////

class View {
  constructor(element, options) {
    this.element = element;
    this.options = options || {};
  }

  destructor() {
    LOG(`view destructor ${this.id}`);
    this.element = null;
    this.options = null;

    this.projects = null;
    this.pageData = {};
  }

  // //////////////

  enableSmoothScroll(element) {
    element.parentNode.style.WebkitOverflowScrolling = 'touch';
    element.style.WebkitPerspective = '0';
    //  this.preventScrollFreeze()
    //  this.element.style.backgroundColor = "yellow"
  }

  createButtonElement() {
    const li = document.createElement('li');

    return li;
  }

  createFrame() {
    const frame = document.createElement('div');
    frame.className = 'frame';
    return frame;
  }

  createCanvas(page, width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width || page.width;
    canvas.height = height || page.height;
    return canvas;
  }

  createTexts(page, text) {
    const texts = document.createElement('div');
    texts.innerHTML = text || page.params.text;
    return texts;
  }

  isDialog() {
    return false;
  }
}

export { View };


/*
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
        if (dirY === "up") {
          LOG('up')
          e.preventDefault();
        }

      } else if (scrollTop >= e.currentTarget.scrollHeight - height) {
        if (dirY === "down") {
          LOG('down')
          e.preventDefault();
        }
      }
      if (scrollLeft === 0) {
        if (dirX === "left") {
          LOG('left')
          e.preventDefault();
        }

      } else if (scrollLeft >= e.currentTarget.scrollWidth - width) {
        if (dirX === "right") {
          LOG('right')
          e.preventDefault();
        }
      }
      this.lastX = x;
      this.lastY = y;
    }.bind(this))
  } */
