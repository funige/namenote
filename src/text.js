import { namenote } from './namenote.js';

/**
 * To create text element, 5 basic params are required:
 * - fontFamily
 * - fontSize
 * - writingMode
 * - left
 * - top
 */

class Text {
  static getHTML(element) {
    const p = $(element.outerHTML)[0];
    this.cleanup(p);
    return p.outerHTML;
  }

  static cleanup(p) {
    p.classList.remove('editable', 'selected');
    p.style.color = '';
    p.innerHTML = this.flatten(p.innerHTML);
    return p;
  }

  static flatten(text) {
    return text
      .replace(/\r|\n/g, '')
      .replace(/(<([^>]+)>)/g, '\n')
      .replace(/\/+/g, '/')
      .replace(/^\//, '')
      .replace(/\/$/, '')
      .replace(/\n/g, '<br>');
  }

  static toPlainText(html) { // for CSNF export
    let result = html
      .replace(/^<div[^>]*>/, '')
      .replace(/(<br>)?<\/div><div[^>]*>/g, '\n')
      .replace(/<br>/g, '\n')
      .replace(/<div[^>]*>/g, '\n')
      .replace(/<\/div>/g, '');

    result = result
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&');

    console.log(html, '=>', result);
    return result;
  }

  static measure(element) {
    return new Promise((resolve) => {
      const tmp = element.cloneNode(true);
      tmp.id = '';
      tmp.style.visibility = 'hidden';
      $('body')[0].appendChild(tmp);

      setTimeout(() => {
        const rect = { width: tmp.offsetWidth, height: tmp.offsetHeight };
        tmp.parentNode.removeChild(tmp);
        resolve(rect);
      }, 0);
    });
  }

  static fixPosition(element) {
    const width = element.offsetWidth;
    const height = element.offsetHeight;

    if (Text.isVert(element)) {
      const data = JSON.parse(element.alt);
      if (width !== data.width) {
        const left = parseFloat(element.style.left) - (width - data.width);
        element.style.left = left + 'px';
      }
    }
    element.alt = JSON.stringify({ width: width, height: height });
  }

  static isVert(element) {
    return (element.style.writingMode === 'vertical-rl');
  }

  static createNext(node) {
    const p = (node) ? node.cloneNode() : this.createFromTemplate();
    p.id = namenote.getUniqueID();
    p.style.left = (parseFloat(p.style.left) - 12) + 'px';
    p.innerHTML = '';
    return p;
  }

  static createFromTemplate({
    x = 0,
    y = 0,
    font = 'sans-serif',
    size = 14,
    vert = true
  } = {}) {
    const p = document.createElement('p');
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    p.style.fontFamily = font;
    p.style.fontSize = size + 'px';
    p.style.writingMode = vert ? 'vertical-rl' : 'horizontal-tb';
    return p;
  }
}

export { Text };
