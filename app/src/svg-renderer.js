import { namenote } from './namenote.js';

// //////////////////////////////////////////////////////////////

class SVGRenderer {
  constructor() {
  }

  init() {
  }

  capture() {
  }

/*
  fixTexts() {
    const array = this.texts.innerHTML.split(/<div class="text.*?"/)
    for (let i = 0; i < array.length; i++) {
      let text = array[i]
      if (text.length > 0) {
        text = "<div" + array[i]
        text = text.replace(/&nbsp;/g, '&#160;')
        text = text.replace(/&copy;/g, '&#169;')
        text = text.replace(/&laquo;/g, '&#171;')
        text = text.replace(/&raquo;/g, '&#187;')
        text = text.replace(/&yen;/g, '&#165;')
        text = text.replace(/&plusmn;/g, '&#177;')
        text = text.replace(/&minus;/g, '&#8722;')
        text = text.replace(/style="/g, 'style="white-space:nowrap; z-index:100; color:#bf0058;')

        text = text.replace(/<br>/g, "<br\/>")
        text = text.replace(/<br\/><\/div>/g, "<\/div>")
        text = text.replace(/<div>(.*?)<\/div>/g, "<br\/>$1")
        array[i] = text
      }
    }
    //nn.log('=>', array)
    return array.join('') //('\n\n')
  }

  capture(callback) {
    const style = 'position:absolute;'
    const image = this.canvas.toDataURL('image/png')
    const texts = this.fixTexts()

    const width = this.canvas.width
    const height = this.canvas.height

    const destCanvas = document.createElement('canvas')
    destCanvas.width = this.project.exportSize[0]
    destCanvas.height = this.project.exportSize[1]
    const ctx = destCanvas.getContext('2d')
    ctx.drawImage(this.bg, 0, 0)

    const data = `
       <svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>
         <foreignObject width='100%' height='100%'>
           <div xmlns='http://www.w3.org/1999/xhtml' style='${style}'>
　　　　　　　${texts}
           </div>
           <div xmlns='http://www.w3.org/1999/xhtml' style='${style}'>
             <img src='${image}' />
           </div>
         </foreignObject>
       </svg>`

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0)
      LOG('capture success...')
      callback(destCanvas.toDataURL('image/png')
    }
    img.onerror = (err) => {
      LOG('capture failed...', texts)
      LOG(err)
      callback(null)
    }

    const b64 = window.btoa(unescape(encodeURIComponent(data)));
    img.src = "data:image/svg+xml;base64," + b64
  }
*/
}

const svgRenderer = new SVGRenderer();

export { svgRenderer };
