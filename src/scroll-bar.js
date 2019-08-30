

class ScrollBar {
  constructor(content, type) {
    this.content = content;
    this.type = type;
    this.element = content.parentNode.querySelector(`.${type}-scroll-bar`);

    this.init();
  }

  init() {
    this.slider = $('<div>').addClass('slider').appendTo($(this.element));
    this.slider.on('mousedown', () => {
      this.drag = true;
      console.log('mousedown', this.type);
    });

    this.slider.on('mousemove', () => {
      if (this.drag) {
        console.log('mousemove', this.type);
      }
    });

    this.slider.on('mouseup', () => {
      if (this.drag) {
        console.log('mouseup', this.type);
        this.drag = false;
      }
    });
}

  slideHorizontal() {
    const width = this.content.offsetWidth;
    const scrollWidth = this.content.scrollWidth;
    const scrollLeft = this.content.scrollLeft;
    this.slider[0].style.width = width * (width / scrollWidth) + 'px';
    this.slider[0].style.left = width * (scrollLeft / scrollWidth) + 'px';
  }

  slideVertical() {
    const height = this.content.offsetHeight;
    const scrollHeight = this.content.scrollHeight;
    const scrollTop = this.content.scrollTop;
    this.slider[0].style.height = height * (height / scrollHeight) + 'px';
    this.slider[0].style.top = height * (scrollTop / scrollHeight) + 'px';
  }
  
  onresize() {
    console.warn(this);
    switch (this.type) {
      case 'bottom':
        this.slideHorizontal();
        break;

      default:
        this.slideVertical();
        break;
    }
  }
}

export { ScrollBar };
