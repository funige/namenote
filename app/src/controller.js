const minMove = 5

let moved = false
let stroke = false

////////////////////////////////////////////////////////////////

class Controller {
  constructor() {
    this.api = 'pointer'

    this.spaceKey = false
    this.altKey = false
    this.ctrlKey = false
    this.shiftKey = false
  }

  updatePointer(e) {
    this.x = (e.clientX !== undefined) ? e.clientX : e.touches[0].clientX
    this.y = (e.clientY !== undefined) ? e.clientY : e.touches[0].clientY
    this.pressure = e.pressure

    if (stroke) {
      LOG(this.x, this.y, this.pressure)
    }
  }

  init() {
    window.addEventListener(this.api + 'down', (e) => {
      this.updatePointer(e)
      this.pointerId = e.pointerId

      this.x0 = this.x
      this.y0 = this.y
      this.onDown(e)
    })

    window.addEventListener(this.api + 'up', (e) => {
      this.onUp(e)
    })

    window.addEventListener(this.api + 'move', (e) => {
      if (this.pointerId != e.pointerId) return

      this.updatePointer(e)
      if (Math.abs(this.x - this.x0) >= minMove ||
          Math.abs(this.y - this.y0) >= minMove) {
        moved = true
      }
      this.onMove(e)
    })

    document.addEventListener('keydown', (e) => {
      this.altKey = e.altKey
      this.ctrlKey = e.ctrltKey
      this.shiftKey = e.shiftKey
      if (e.keyCode == 32) this.spaceKey = true
    })

    document.addEventListener('keyup', (e) => {
      this.altKey = e.altKey
      this.ctrlKey = e.ctrltKey
      this.shiftKey = e.shiftKey
      if (e.keyCode == 32) this.spaceKey = false
    })

    document.addEventListener('cut', (e) => { ERROR('cut') })
    document.addEventListener('copy', (e) => { ERROR('copy') })
    document.addEventListener('paste', (e) => { ERROR('paste') })
  }
  
  ////////////////

  onDown(e) {
  }

  onUp(e) {
  }

  onMove(e) {
  }

  ////////////////
  
  isMoved() {
    return moved
  }

  clearMove() {
    if (!this.spaceKey) moved = false
  }
}

const controller = new Controller()

export { controller }
