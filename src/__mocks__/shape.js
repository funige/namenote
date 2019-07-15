class Shape {
  parse() {}
  
  setDPI(dpi) {
    this.dpi = dpi;
  }

  topx(mm) {
    if (typeof mm === 'number') {
      return Math.round(mm * (this.dpi / 25.4));
    }
    return mm.map((x) => Math.round(x * (this.dpi / 25.4)));
  }

  tomm(px) {
    if (typeof px === 'number') {
      return Math.round(px * (25.4 / this.dpi));
    }
    return px.map((x) => Math.round(x * (25.4 / this.dpi)));
  }
}

const shape = new Shape();

export { shape };
