import { file } from './file.js';
import { CSNFTime } from './csnf-time.js';
import { Canvas } from './canvas.js';
import { Text } from './text.js';
import { T } from './locale.js';
import { namenote } from './namenote.js';

import { CSNF, CSNFBitmap } from '/usr/local/lib/node_modules/csnf';

const JSZip = require('jszip');
const csnfStream = require('../js/lib/csnf-stream');
const memoryStreams = require('memory-streams');

let files = [];
let images = [];
let data = {};
let pack = null;


class CSNFExporter {
  constructor(project, options = {}) {
    this.project = project;
    this.options = options;

  }

  async write(filename) {
    const project = this.project;
    const csnf = new CSNF({
      bindRight: project.params.bind_right,
      startpageRight: project.params.startpage_right,
      dpi: project.params.dpi,
      baseframeSize: project.params.baseframe_size,
      finishingSize: project.params.finishing_size,
      sheetSize: project.params.sheet_size,
      title: project.name(),
    });

    for (var page of project.pages) {
      var item = csnf.addPage(page.pid);

      var bitmap = await this.getBitmap(page);
      if (bitmap) {
        item.addDrawLayer(bitmap);
      }
      var texts = await this.getTexts(page);
      if (texts.length > 0) {
        item.addTextLayer(texts);
      }
    }
    
    if (this.options.monitor) {
      let index = 1;
      csnf.on('page', page => {
        this.options.monitor.log(T('Page') + ' ' + index++ + '...');
      })
    }

    var data = await csnf.write()
    file.writeFile(filename, data).then(err => {
      if (err) throw new Error(err)
    })
  }

  async getTexts(page) {
    const scale = 1; // page.project.exportScale

    const count = page.texts.length; //page.texts.children.length;
    const shape = [];

    for (let i = 0; i < count; i++) {
      const element = Text.toElement(page.texts[i]); //page.texts.children[i];
      const rect = await Text.measure(element);

      let x = parseFloat(element.style.left) + rect.width / 2;
      let y = parseFloat(element.style.top) + rect.height / 2;
      x *= scale;
      y *= scale;

      const size = parseFloat(element.style.fontSize) * scale;
      const string = Text.toPlainText(element.innerHTML);
      const vert = (element.style.writingMode == 'vertical-rl');

      const item = [5, x, y, size, 0, 0, vert, string]; //, 100, 200, 300];
      shape.push(item);
    }
    return shape
  }

  async getBitmap(page) {
    let bitmap;
    if (page) {
      const scale = 1; // page.project.exportScale
      // bitmap = Canvas.makeBitmap(page.canvas, scale);
      bitmap = CSNFBitmap.fromCanvas(page.canvas, scale);
      
    } else {
      bitmap = new Uint8Array(2 * 2 + 4);
      bitmap[0] = 2;
      bitmap[2] = 2;
    }
    return bitmap;
  }
  
  /*
     load(project) {
     }
   */
  
  /*
     async ___write(filename, callback) {
     const project = this.project;
     pack = csnfStream.pack();

     await this.makeData(project);
     this.zipData(images, (err) => {
     if (!err) {
     this.packData(files, (err) => {
     if (!err) {
     pack.on('end', () => {
     file.writeFile(filename, writeStream.toBuffer());
     });

     // const writeStream = file.createWriteStream(filename);
     const writeStream = new memoryStreams.WritableStream();
     pack.pipe(writeStream);
     if (callback) callback();
     } else console.log(err);
     });
     } else console.log(err);
     });
     }

     packData(files, callback) {
     if (files.length > 0) {
     const name = files.shift();
     const raw = data[name];
     const header = { name: name };
     console.log('...pack', name, raw ? raw.length + 'bytes' : '');

     if (raw) {
     header.size = raw.length;
     header.type = 'file';
     } else {
     header.size = 0;
     header.type = 'directory';
     }

     setImmediate(() => {
     pack.entry(header, raw);
     this.packData(files, callback);
     });
     } else {
     console.log('finalize');
     pack.finalize();
     callback();
     }
     }

     zipData(images, callback) {
     if (images.length > 0) {
     const item = images.shift();
     console.log('...zip', item.name, item.data.length);
     // exportCSNFDialog.showMessage(T('Rendering') + ` ${images.length}...`)

     const zip = new JSZip();
     zip.file(item.name, item.data, { createFolders: false, binary: true });

     zip.generateAsync({
     type: 'uint8Array',
     compression: 'DEFLATE',
     compressionOptions: {
     level: 6
     }
     }).then((content) => {
     //data[item.name] = pack.newBuffer(content);
     data[item.name] = new Buffer(content);
     console.log(item.name, content.length, 'bytes...');

     this.zipData(images, callback);
     });
     } else {
     callback();
     }
     }

     initData(project) {
     const story = this.getStory(project);
     const dir = `/${story.story_id}`;
     files = [dir, `${dir}/story.json`];
     data = {};
     data[files[1]] = JSON.stringify({ body: story });
     images = [];
     }

     async makeData(project) {
     this.initData(project);
     const dir = files[0];
     const result = [];

     const scale = 1; // project.exportScale
     for (let i = 0; i < project.pages.length; i++) {
     //  for (let i = project.exportStart - 1; i <= project.exportEnd - 1; i++) {
     const page = project.pages[i];
     const pageDir = `${dir}/${page.pid}`;
     files.push(pageDir);

     const image = `${pageDir}/ly_d0`;
     files.push(image);
     images.push({ name: image, data: await this.getBitmap(page, scale) });

     const text = `${pageDir}/ly_t0_t`;
     files.push(text);
     data[text] = await this.getText(page);
     }
     }
   */
  
  /*
     getStory(project) {
     const pageinfo = this.getPageInfo(project);
     const scale = 1; // project.exportScale (1 or 0.815934)
     const body = {};
     body.finishing_id = 6;
     body.sheet_id = (scale == 1) ? 3 : 2;
     body.sheet_size = project.params.sheet_size; // helper.scale(project.params.export_size, scale)
     body.serial_id = body.page_count + 1;
     body.page_count = project.pages.length; // (project.exportEnd - project.exportStart) + 1
     body.version = 1;
     body.bind_right = project.params.bind_right;
     body.finishing_size = project.params.finishing_size; // helper.scale(project.params.finishing_size, scale)
     body.baseframe_id = 6;
     body.author = '';
     body.story_id = 1;
     body.title = project.name(); // project.exportName
     body.pageinfo_count = pageinfo.length;
     body.startpage_right = project.params.startpage_right;
     body.edit_date = CSNFTime.toString();
     body.baseframe_size = project.params.baseframe_size; // helper.scale(project.params.baseframe_size, scale)
     body.dpi = project.params.dpi;
     body.last_modify = 4;
     body.pageinfo = pageinfo;
     body.cover_col = 3;
     body.layer_color = [
     [-7950848, -16736256, -16777216],
     [-16738348, -16777056, -16777216],
     [-4259752, -6291456, -16777216],
     [-1918976, -6250496, -16777216]
     ];
     return body;
     }
   */

  /*
     async getText(page) {
     const texts = await this.getTexts(page)
     const result = {};
     result.body = { count: texts.length, shape: texts };
     return JSON.stringify(result);
     }
   */
  
  /*
  getPageInfo(project, startPage, endPage) {
    const info = [];

    if (startPage === undefined) startPage = 1;
    if (endPage === undefined) endPage = project.pages.length;

    const array = this.getPageArray(project, startPage, endPage);
    let counter = 1;

    for (let i = 0; i < array.length; i += 2) {
      const item = [0];
      const i0 = array[i] ? counter++ : 0;
      const i1 = array[i + 1] ? counter++ : 0;

      if (project.params.bind_right) {
        item.push(i1, array[i + 1]);
        item.push(i0, array[i]);
      } else {
        item.push(i0, array[i]);
        item.push(i1, array[i + 1]);
      }
      info.push(item);
    }
    return info;
  }

  getPageArray(project, startPage, endPage) {
    const array = [];
    const bind = project.params.bind_right;
    const start = project.params.startpage_right;
    if ((bind && !start) || (!bind && start)) array.push(0);

    for (let i = startPage - 1; i <= endPage - 1; i++) {
      array.push(project.pages[i].pid);
    }
    if (array.length & 1) array.push(0);
    return array;
  }
  */
}

export { CSNFExporter };
