

class ScrollBar {
  constructor(content, type) {
    this.content = content;
    this.type = type;
    this.element = content.parentNode.querySelector(`.${type}-scroll-bar`);
    //  this.element.style.backgroundColor = 'pink';

    this.init();
  }

  init() {
    const sliderDiv = $('<div>').addClass('slider').appendTo($(this.element));
    sliderDiv.on('click', () => {
      console.log('www');
    });
  }
}

export { ScrollBar };
