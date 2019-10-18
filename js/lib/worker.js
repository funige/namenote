importScripts('jszip.min.js')

var zip = new JSZip();

self.onmessage = function(e) {
  const data = e.data
  const imageData = data.imageData
  zip.file('image', imageData.data.buffer, { craeteFolders: false, binary: true })

  zip.generateAsync({
    type: 'base64',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }

  }).then((content) => {
    data.base64 = content
    data.err = null
    self.postMessage(data)
  })
}

function savePage(data) {
}
