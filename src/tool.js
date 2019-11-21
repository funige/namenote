

class Tool {
  constructor(options) {
    this.options = options || {};
  }

  destructor() {
    this.options = null;
  }

  start() {
    // console.log(`[${this.name} start]`);
  }

  stop() {
    // console.log(`[${this.name} stop]`);
  }

  onDown(e) {
  }

  onUp(e) {
  }

  onMove(e) {
  }

  getBound(stroke, w) {
    let xmin = stroke[0][0];
    let ymin = stroke[0][1];
    let xmax = xmin;
    let ymax = ymin;

    stroke.forEach(point => {
      const x = point[0];
      const y = point[1];

      if (x > xmax) xmax = x;
      if (y > ymax) ymax = y;
      if (x < xmin) xmin = x;
      if (y < ymin) ymin = y;
    });

    const rect = {
      x: Math.floor(xmin - w / 2),
      y: Math.floor(ymin - w / 2),
      width: Math.ceil(xmax - xmin + w + 1),
      height: Math.ceil(ymax - ymin + w + 1)
    };
    //console.warn('getBound', rect);
    return rect;
  }
}

export { Tool };
