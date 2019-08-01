import { file } from './file.js';
import { svgRenderer } from './svg-renderer.js';

const pdfMake = require('pdfmake/build/pdfmake.js')
const pdfFonts = require('pdfmake/build/vfs_fonts.js')
pdfMake.vfs = pdfFonts.pdfMake.vfs;

let images = []
let docDefinition = {}

class PDF {
  initData(project) {
    const width = project.canvasSize.width;
    const height = project.canvasSize.height;

    docDefinition = {
      pageSize: { width: width, height: height },
      pageMargin: [ 0, 0 ],
      content: [],
    };
    images = [];
  }

  makeData(project) {
    this.initData(project);

    project.pages.map(page => images.push(page));
    console.log('make data', images);
  }

  renderData(images, callback) {
    if (images.length > 0) {
      const page = images.shift();
      console.log('...render', page.pid)

      svgRenderer.capture(page, (png) => {
        if (!png) console.error('ummm?', page);
        const item = {
          image: png,
          width: page.project.canvasSize.width,
          height: page.project.canvasSize.height,
          absolutePosition: { x:0, y:0 },
        }
        if (images.length > 0) item.pageBreak = 'after'
        docDefinition.content.push(item);

        
        this.renderData(images, callback)
      })

    } else {
      callback()
    }
  }

  write(project, filename, callback) {
    console.log('write', filename, project, '...');

    this.makeData(project);
    this.renderData(images, (err) => {
      if (!err) {
        console.log('docDefinishion is done, create pdf...', docDefinition);

        pdfMake.createPdf(docDefinition).getBuffer((buffer) => {
          file.writeFile(filename, buffer).then((err) => {
            console.log('pdf finished..');
            if (callback) callback(err)
          });
        })
      } else console.log(err)
    })
    console.log('rendering...');
  }
}

const pdf = new PDF();

export { pdf }
