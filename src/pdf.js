import { file } from './file.js';
import { svgRenderer } from './svg-renderer.js';
import { T } from './locale.js';

const pdfMake = require('pdfmake/build/pdfmake.js');
const pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

let pages = [];
let docDefinition = {};

class PDF {
  constructor(project, options = {}) {
    this.project = project;
    this.options = options;

    if (options.monitor) { options.monitor.log(T('Making PDF ...')); }
  }

  load(project) {
    const width = project.canvasSize.width;
    const height = project.canvasSize.height;

    docDefinition = {
      pageSize: { width: width, height: height },
      pageMargin: [0, 0],
      content: []
    };
  }

  write(filename, callback) {
    const project = this.project;
    console.log('write', filename, project, '...');

    this.load(project);
    pages = [...project.pages];

    this.renderData(pages, (err) => {
      if (!err) {
        console.log('docDefinishion is done, create pdf...', docDefinition);

        pdfMake.createPdf(docDefinition).getBuffer((buffer) => {
          file.writeFile(filename, buffer).then((err) => {
            console.log('pdf finished..');
            if (callback) callback(err);
          });
        });
      } else console.log(err);
    });
    console.log('rendering...');
  }

  renderData(pages, callback) {
    if (pages.length > 0) {
      const page = pages.shift();
      console.log('...render', page.pid);

      svgRenderer.capture(page, (png) => {
        if (!png) console.error('ummm?', page);
        const item = {
          image: png,
          width: page.project.canvasSize.width,
          height: page.project.canvasSize.height,
          absolutePosition: { x: 0, y: 0 }
        };
        if (pages.length > 0) item.pageBreak = 'after';
        docDefinition.content.push(item);

        this.renderData(pages, callback);
      });
    } else {
      callback();
    }
  }
}

export { PDF };
