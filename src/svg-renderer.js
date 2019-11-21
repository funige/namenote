
class SVGRenderer {
  init() {
  }

  getFixedTexts(page) {
    const array = page.texts.map((text) => {
      return page.toElement(text).outerHTML
                 .replace(/&nbsp;/g, '&#160;')
                 .replace(/&copy;/g, '&#169;')
                 .replace(/&laquo;/g, '&#171;')
                 .replace(/&raquo;/g, '&#187;')
                 .replace(/&yen;/g, '&#165;')
                 .replace(/&plusmn;/g, '&#177;')
                 .replace(/&minus;/g, '&#8722;')
                 .replace(/style="/g, 'style="position:absolute; white-space:nowrap; z-index:100; color:#bf0058; ')
                 .replace(/<br>/g, '<br/>')
                 .replace(/<br\/><\/div>/g, '</div>')
                 .replace(/<div>(.*?)<\/div>/g, '<br/>$1')
    });
    return array.join('');    
  }
  
  capture(page, callback) {
    const style = 'position:absolute;';
    const image = page.canvas.toDataURL('image/png');
    const texts = this.getFixedTexts(page);
    const marks = page.project.draftMarks().outerHTML;

    const width = page.canvas.width;
    const height = page.canvas.height;

    const destCanvas = document.createElement('canvas');
    destCanvas.width = page.project.canvasSize.width;
    destCanvas.height = page.project.canvasSize.height;
    const ctx = destCanvas.getContext('2d');

    const data = `
       <svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>
         <rect width="100%" height="100%" fill="white"/>
         ${marks}

         <foreignObject width='100%' height='100%'>
           <div xmlns='http://www.w3.org/1999/xhtml' style='${style}'>
             ${texts}
           </div>
           <div xmlns='http://www.w3.org/1999/xhtml' style='${style}'>
             <img src='${image}' />
           </div>
         </foreignObject>
       </svg>`;

    const img = new Image();

    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      console.log('capture success...');
      if (callback) {
        const png = destCanvas.toDataURL('image/png');
        callback(png);
      }
    };
    img.onerror = (err) => {
      console.log('capture failed...', texts);
      console.log(err);
      if (callback) callback(null);
    };

    const b64 = window.btoa(unescape(encodeURIComponent(data)));
    img.src = 'data:image/svg+xml;base64,' + b64;
  }
}

const svgRenderer = new SVGRenderer();

export { svgRenderer };
