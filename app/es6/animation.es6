'use strict'

import { Project } from './project.es6'
import { View } from './view.es6'


class Animation {}

Animation.data = null

Animation.setScroll = (vx, vy) => {
  if (Animation.data) {
    Animation.cancel()
  }

  const target = $('.root')[0].parentNode
  const x0 = target.scrollLeft
  const y0 = target.scrollTop
  const now = Date.now()
  
  Animation.data = {
    type: 'scroll',
    vx: vx, vy: vy,
    x0: x0,
    y0: y0,
    t0: now,
    t: now,
  }
  Animation.update(0)
}

Animation.setJump = (x, y, power, duration) => {
  if (Animation.data) {
    Animation.cancel()
  }

  duration = 0;
  
  const project = Project.current
  if (!project) return
  
  const target = $('.root')[0].parentNode
  
  const x0 = target.scrollLeft
  const y0 = target.scrollTop
  const power0 = project.bookmark.power
  
  Animation.data = {
    type: 'jump',
    x0: x0, x1: x,
    y0: y0, y1: y,
    power0: power0, power1: power,
    timer: duration,
    duration: duration
  }
  Animation.update(0)
}

Animation.cancel = () => {
  Animation.data = null
}

Animation.busy = () => {
  return (Animation.data) ? true : false
}

////////////////////////////////////////////////////////////////

Animation.update = (count) => {
  if (!Animation.data) return

  if (Animation.data.type == 'jump') {
    Animation.updateJump(count)
  } else {
    Animation.updateScroll(count)
  }
}

Animation.updateJump = (count) => {
  const target = $('.root')[0].parentNode
  const data = Animation.data

  data.timer--;

  const x = 1 - data.timer / data.duration
  let k = 1 - (x * x * x)
  if (k < 0.7) k = 0
  
  const c = Project.current.bookmark
  c.power = data.power0  * k + data.power1 * (1 - k)
  
  View.update()
  target.scrollLeft = data.x0 * k + data.x1 * (1 - k)
  target.scrollTop = data.y0 * k + data.y1 * (1 - k)

  if (data.timer > 0) {
    requestAnimationFrame(() => {
      Animation.update()
    })

  } else {
    Animation.data = null
  }
}

Animation.updateScroll = (count) => {
  const target = $('.root')[0].parentNode
  const data = Animation.data
  
  const now = Date.now()
  const elapsed = (now - data.t0)

  const dt = (now - data.t) / 1000.0
  const dx = data.vx * Math.exp(-elapsed / 325) * dt
  const dy = data.vy * Math.exp(-elapsed / 325) * dt

  if (count <= 0) {
    data.vx *= 0.8
    data.vy *= 0.8
      
  } else {
    data.x0 -= dx
    data.y0 -= dy
    target.scrollLeft = data.x0
    target.scrollTop = data.y0

  }
  data.t = now

  const d = Math.abs(dx) + Math.abs(dy)
  
  if (count == 0 || d > 0.5) {
    requestAnimationFrame(() => {
      Animation.update(count + 1)
    })
    
  } else {
    Animation.data = null
  }
}
  

export { Animation }
