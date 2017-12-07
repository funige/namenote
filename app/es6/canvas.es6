'use strict'


class Canvas {}

Canvas.copy = (ctx, canvas, x, y, width, height) => {
  if (x == undefined) x = 0
  if (y == undefined) y = 0
  if (width == undefined) width = canvas.width
  if (height == undefined) height = canvas.height
  ctx.drawImage(canvas, x, y, width, height, x, y, width, height)
}

Canvas.makeBitmap = (canvas, scale) => {
  const width = canvas.width;
  const height = canvas.height;
  const bitmapWidth = Math.round(width * scale)
  const bitmapHeight = Math.round(height * scale)
  const bitmap = new Uint8Array(bitmapWidth * bitmapHeight + 4);
  nn.log('makebitmap', width, height, bitmapWidth, bitmapHeight)
  
  bitmap[0] = bitmapWidth % 0x100
  bitmap[1] = Math.floor(bitmapWidth / 0x100)
  bitmap[2] = bitmapHeight % 0x100
  bitmap[3] = Math.floor(bitmapHeight / 0x100)

  let ctx, imageData
  if (scale == 1) {
    ctx = canvas.getContext("2d")
    imageData = ctx.getImageData(0, 0, width, height)

  } else {
    const tmpCanvas = document.createElement('canvas')
    tmpCanvas.width = bitmapWidth
    tmpCanvas.height = bitmapHeight
    ctx = tmpCanvas.getContext("2d")
    ctx.drawImage(canvas, 0, 0, width, height, 0, 0, bitmapWidth, bitmapHeight)
    imageData = ctx.getImageData(0, 0, bitmapWidth, bitmapHeight)
  }
  
  const buf8 = new Uint8ClampedArray(imageData.data.buffer)

  let index = 0
  for (let y = 0; y < bitmapHeight; y++) {
    for (let x = 0; x < bitmapWidth; x++) {
      bitmap[index + 4] = buf8[index * 4 + 3]
      index++
    }
  }
  return bitmap
}

export { Canvas }
