import { Tool } from './tool.js';
import { namenote } from './namenote.js';
import { history } from './history.js';
import { autosave } from './autosave.js';
import { toolManager } from './tool-manager.js';
import { pointer } from './pointer.js';
import { Text } from './text.js';

// onUpのとき moved==false　ならば、他のkeyをclearしてcontentEditableにする。
// moved==false でもshiftが押されている時は追加選択モード。ctrlでトグル。

// バウンディングボックスを作って、可能な時はページ移動する
// ・まずページからはみだしたテキストも表示されるようにする
// ・バグンディングボックスの計算
// ・(どこかの)ページに収まるかどうかの判定
// ・onUpでactionをプッシュ。moveTextの発行。editTextの発行。選択状態の引き継ぎ。

class TextMoveTool extends Tool {
  constructor() {
    super();
    this.name = 'textMove';
  }

  onDown(x, y) {
    console.log(this.name, 'onDown');
    this.array = Text.toTexts(namenote.mainView.project.currentKeys);
    this.x0 = x;
    this.y0 = y;
  }

  onUp(stroke) {
    if (!pointer.isMoved()) {
      const key = pointer.info.key;
      namenote.mainView.project.setCurrentKey(key);
      const element = namenote.mainView.keyElement(key);
      element.classList.add('editable');
      element.contentEditable = true;
      //const size = parseFloat(element.style.fontSize);
      //element.style.fontSize = size * 3 + 'px';
      
      if (element !== document.activeElement) {
        setImmediate(() => {
          console.log('[focus]', pointer.info.key);
          element.focus();
        });
      }
    }
    console.log(this.name, 'onUp', pointer.isMoved());
    toolManager.pop();
  }

  onMove(x, y) {
    console.log(this.name, 'onMove');
    const scale = namenote.mainView.scale;
    const dx = (x - this.x0) / scale;
    const dy = (y - this.y0) / scale;
    namenote.mainView.project.currentKeys.forEach((key, index) => {
      const item = this.array[index];
      const element = document.getElementById('p' + key);
      element.style.left = (item.x + dx) + 'px';
      element.style.top = (item.y + dy) + 'px';
    });
  }
}

export { TextMoveTool };
