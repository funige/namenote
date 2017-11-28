'use strict'


const projectTemplate = {
  'Manga': {
    description: '72dpi',
    params: {
      title: null,
      author: null,
      bg: null,
      
      page_count: 15,
      bind_right: true,
      startpage_right: false,
    
      dpi: 72,
      baseframe_size: [180, 270],
      finishing_size: [220, 310],
      export_size: [257, 364],
      page_size: [364, 364],
      paper_string: 'B4 JIS',
    },
  },
}


export { projectTemplate }
