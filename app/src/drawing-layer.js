import { namenote } from './namenote.js'


class DrawingLayer {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'scratch';
    this.canvas.style.backgroundColor = "red";
    this.canvas.style.opacity = "0.3";
    document.body.appendChild(this.canvas);
  }
  
  init(element) {
    this.element = element;
    this.onresize();
  }
  
  onresize() {
    if (this.element) {
      this.canvas.style.width = (this.element.clientWidth) + 'px';
      this.canvas.style.height = (this.element.clientHeight) + 'px';
    }
  }
 
}

export { DrawingLayer }

