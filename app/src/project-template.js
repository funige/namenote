const projectTemplate = {
  Manga: {
    description: '',
    dpi: 72,
    page_count: 16;
    bind_right: true,

    baseframe_size: [180, 270],
    finishing_size: [220, 310], //=thumbnail_rect
    canvas_size: [257, 364],

    page: {
      marks: {},
    },

    print: {
      pages: [
      ],
      marks: {},
    },
  },
  
  Anime: {
    description: '',
    dpi: 72,
    page_count: 16;
    bind_right: false,

    baseframe_size: [180, 270],
    finishing_size: [220, 310],
    canvas_size: [257, 364],
  },
}

export { projectTemplate }
