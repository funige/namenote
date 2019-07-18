

class DrawingLayer {
  init(element) {
    this.element = element;
    this.canvas = element.parentNode.querySelector('.drawing-layer');
    this.ctx = this.canvas.getContext('2d');
    this.onresize();
  }

  draw() {
    this.clear();
  }

  clear() {
    if (this.element) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  onresize() {
    if (this.element) {
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
