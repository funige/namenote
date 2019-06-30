import { namenote } from './namenote.js'

/**
 * To create text element, 5 basic params are required:
 * - fontFamily 
 * - fontSize
 * - writingMode
 * - left
 * - top
 */

class Text {
  static cleanup(text) {
    // TODO: '/'がtextに含まれているときパースに失敗するので修正が必要
    return text
      .replace(/\r|\n/g, '')
      .replace(/(<([^>]+)>)/g, '/')
      .replace(/\/+/g, '/')
      .replace(/^\//, '')
      .replace(/\/$/, '')
      .replace(/\//g, '<br>');
  }
 
  static createText(string, {
    x = 0,
    y = 0,
    font = 'sans-serif',
    size = 14,
    vert = true
  } = {}) {
    
    const p = document.createElement('div')
    p.id = namenote.getUniqueID();
    p.innerHTML = Text.cleanup(string)
    $(p).css('left', x + 'px');
    $(p).css('top', y + 'px');
    $(p).css('font-family', font);
    $(p).css('font-size', size + 'px');
    $(p).css('writing-mode', vert ? 'vertical-rl' : 'horizontal-tb');

    return p
  }


/*  
  static getParams(element) {
    const params = [}
    if (element) {
      params.font = element.style.fontFamily;
      params.size = element.style.fontSize;
      params.vert = element.style.writingMode;

    } else {
      params.font = 'sans-serif';
      params.size = '14px';
      params.vert = 'vertical-rl'
    }
    return params
  }
*/
}

const text = new Text();

export { Text, text };
