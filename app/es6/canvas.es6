'use strict'


class Canvas {}

Canvas.copy = (ctx, canvas, x, y, width, height) => {
  if (x == undefined) x = 0
  if (y == undefined) y = 0
  if (width == undefined) width = canvas.width
  if (height == undefined) height = canvas.height
  ctx.drawImage(canvas, x, y, width, height, x, y, width, height)
}

Canvas.makeBitmap = (canvas) => {
  const width = canvas.width;
  const height = canvas.height;
  const bitmap = new Uint8Array(width * height + 4);
  nn.log('makebitmap', width, height)
  bitmap[0] = width % 0x100
  bitmap[1] = Math.floor(width / 0x100)
  bitmap[2] = height % 0x100
  bitmap[3] = Math.floor(height / 0x100)

  const ctx = canvas.getContext("2d")
  const imageData = ctx.getImageData(0, 0, width, height)
  const buf8 = new Uint8ClampedArray(imageData.data.buffer)

  let index = 0
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      bitmap[index + 4] = buf8[index * 4 + 3]
      index++
    }
  }
  return bitmap
}

export { Canvas }
