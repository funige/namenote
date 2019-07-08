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
    // TODO: '/'がtextに含まれているときパースに失敗する。リリース前に修正が必要
    return text
      .replace(/\r|\n/g, '')
      .replace(/(<([^>]+)>)/g, '/')
      .replace(/\/+/g, '/')
      .replace(/^\//, '')
      .replace(/\/$/, '')
      .replace(/\//g, '<br>');
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
