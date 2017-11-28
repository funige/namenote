'use strict';

import { Project } from './project.es6'


class Title {}

Title.init = () => {
  Title.setTitle()
}

Title.setTitle = () => {
  let value = (namenote.trial) ? `${T('Namenote')} ${T('Trial')}` : T('Namenote')

  if (Project.current) {
    const project = Project.current
    const index = project.currentPage.index
    const length = project.pages.length
    value = [project.name(), `(${index}/${length})`].join(' ')
  }
  
  if (namenote.app) {
    namenote.app.setTitle(value)
  } else {
    document.title = value
  }
}

Title.reset = () => {
  Title.setTitle()
}


export { Title }
