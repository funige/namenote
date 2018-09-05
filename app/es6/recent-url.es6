'use strict'

import { Menu } from './menu.es6'

const max = 5


class RecentURL {}

RecentURL.list = []

RecentURL.load = () => {
  const json = localStorage.getItem('namenote/recent-url')
  RecentURL.list = (json) ? JSON.parse(json) : [];
}

RecentURL.save = () => {
  const json = JSON.stringify(RecentURL.list)
  localStorage.setItem('namenote/recent-url', json)

  setTimeout(function() {
    Menu.update()
  }, 500);
}

RecentURL.update = (url) => {
  RecentURL.list = RecentURL.list.filter((value) => value != url);
  RecentURL.list.unshift(url)

  if (RecentURL.list.length > max) {
    RecentURL.list.length = max
  }
  RecentURL.save()
}

RecentURL.reset = () => {
  RecentURL.list.length = 0
  RecentURL.save()
}

export { RecentURL }

////////////////////////////////////////////////////////////////

RecentURL.load()
