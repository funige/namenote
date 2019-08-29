
class Rect {
  static get(element) {
    if (!element) return null;   
    return {
      x: element.offsetLeft,
      y: element.offsetTop,
      width: element.offsetWidth,
      height: element.offsetHeight
    };
  }

  static merge(rect0, rect1) {
    if (!rect0) return null;
    if (!rect1) return rect0;
    const x = Math.min(rect0.x, rect1.x);
    const y = Math.min(rect0.y, rect1.y);
    
    return {
      x: x,
      y: y,
      width: Math.max(rect0.x + rect0.width, rect1.x + rect1.width) - x,
      height:Math.max(rect0.y + rect0.height, rect1.y + rect1.height) - y
    };
  }
}

export { Rect }
