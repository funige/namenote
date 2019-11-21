const dummy = {
  project: {
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
      paper_string: 'B4 JIS'
    },
    pids: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
  },
  page: {
    text: ''
  }
};

class File {
  async readdir(url) {
    return [];
  }

  async readJSON(url) {
    if (url.match(/\.namenote$/)) {
      return dummy.project;
    }
    return dummy.page;
  }
}

const file = new File();

export { file, dummy };
