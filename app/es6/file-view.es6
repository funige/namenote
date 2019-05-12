'use strict'

import { View } from './view.es6'
import { projectManager } from './project-manager.es6'


////////////////////////////////////////////////////////////////

class FileView extends View {
  constructor(element, dialogElement) {
    super(element, dialogElement)
    this.id = 'file'
    this.init()
  }

  init() {
    this.project = null
    
    $(this.element).html(``)

    new Sortable(this.element, {
      animation: 150,
      handle: '.sort-handle',
//    scroll: false,
    })
    
    /*$(this.element).selectable({
//    cancel: '.sort-handle, .ui-selected, img',
      cancel: 'div, .sort-handle, .ui-selected, img',
      filter: '> li',

    }).sortable({
      axis: 'y',
      opacity: 0.9,
      items: '> li',
//    handle: 'div, .sort-handle, .ui-selected, img',
      handle: '.sort-handle, .ui-selected, img',
      helper: function(e, item) {
        if (!item.hasClass('ui-selected') ) {
          item.parent().children('.ui-selected').removeClass('ui-selected');
          item.addClass('ui-selected');
        }
        var selected = item.parent().children('.ui-selected').clone();
        WARN(selected)
        //placeholder用の高さを取得しておく
        this.ph = item.outerHeight() * selected.length;
        //item.data('multidrag', selected).siblings('.ui-selected').remove();
        item.data('multidrag', selected)
          .siblings('.ui-selected').each(function(key, item) {
            $(item).addClass('hidden-element').hide()
          })
        return $('<li/>').append(selected);
      },
      start: function(e, ui) {
        console.log(this.ph)
        console.log(ui.placeholder)
        ui.placeholder.css({ height: this.ph })
      },
      stop: function(e, ui) {
        const selected = ui.item.data('multidrag')
        ui.item.after(selected)
        ui.item.remove()
        $('.hidden-element').remove()
      },
      placeholder: 'placeholder',
    })*/
    /*$(this.element).sortable({
      filter: 'li:not(.disabled)',
      autoRefresh: false,
      delay: 0,
    })*/

  }

  initProject(project) {
    if (!this.element) return
    
    this.element.innerHTML = ''
    project.pids().forEach((pid, index) => {
      const pageElement = this.createPageElement(pid)
      this.element.appendChild(pageElement)
      this.pageData[pid] = {
        element: pageElement
      }

      this.updatePage(pid, index)
      if (project.pages[index]) {
        const page = project.pages[index]
        this.initPage(page)
      }
    })
  }
  
  initPage(page) {
    const pd = this.pageData[page.pid]
    if (!pd || !pd.element) {
      ERROR('abort init page', page.pid)
      return
    }

    const rect = this.project.getThumbnailSize()
    pd.thumbnail = new Image(rect.width, rect.height)
    pd.thumbnail.src = page.thumbnail.toDataURL('image/png')

    const text = $(`<div style='width:22px;height:100%;border-right:1px solid #ccc; overflow-x:hidden;font-size:10px;'>830</div><div>${page.digest()}</div>`)
    const handle = $('<div class="sort-handle">[handle]</div>')
    $(pd.element).append(text)
    $(pd.element).append(pd.thumbnail)
    $(pd.element).append(handle)
  }
  
  createPageElement(pid) {
    const element = document.createElement('li')
    return element
  }

  updatePage(pid, index) {
    LOG('updatePage', pid, index)
  }
  
  async loadProject(project) {
    if (this.project) this.project.removeView(this)
    this.project = project
    if (!project) return
    project.addView(this)

    WARN(`[load project] ${project.url}`)
    
    this.pageData = {}
    this.initProject(project)

    const url = project.url.replace(/[^/]+\/[^/]+$/, '')
    if (this.dialogElement) this.dialogElement.updateFolders(url, project.url)
  }

  ////////////////
  
  showProgress(message) {
    WARN('fileView: show progress', message)
  }

  showSpinner() {
    WARN('[show spinner]')
  }

  hideSpinner() {
    WARN('[hide spinner]')
  }
}

export { FileView }
