class Shape {
  parse(data, options) {
    if (!options) options = {};
    if (!options.color) options.color = '#85bffd';

    const result = [];
    data.forEach((item) => {
      const type = item[0];

      switch (type) {
        case 1: // line
          break;

        case 2: // rect
          break;

        case 4: // polyline
          break;

        case 5: // text
          break;

        case 100: // rectangle
          result.push(this.parseRectangle(item, options));
          break;

        default:
          ERROR('unsupported data found', data);
          break;
      }
    });
    return result;
  }

  parseRectangle(item, options) {
    const lineWidth = item[1];
    const x = this.topx(item[2]);
    const y = this.topx(item[3]);
    const width = this.topx(item[4]);
    const height = this.topx(item[5]);
    return `
      <rect x="${x}" y="${y}" width="${width}" height="${height}"
            fill="none" stroke="${options.color}" stroke-width="${lineWidth}" />`;
  }

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

export { shape }
