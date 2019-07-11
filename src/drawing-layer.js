import { namenote } from './namenote.js';


class DrawingLayer {
  init(element) {
    this.element = element;
    this.canvas = element.parentNode.querySelector('.scratch');
    this.onresize();
  }

  onresize() {
    if (this.element && this.canvas) {
      this.canvas.width = this.element.clientWidth;
      this.canvas.height = this.element.clientHeight;
      this.canvas.style.width = (this.element.clientWidth) + 'px';
      this.canvas.style.height = (this.element.clientHeight) + 'px';

      [this.offsetX, this.offsetY] = this.getOffset(this.element);
    }
  }

  getOffset(element) {
    let x = 0;
    let y = 0;
    while (element && element.offsetTop !== undefined) {
      x += element.offsetLeft;
      y += element.offsetTop;
      element = element.parentNode;
    }
    return [x, y];
  }
}

export { DrawingLayer };
