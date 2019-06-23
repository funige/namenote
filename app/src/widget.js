
// jQuery UI Custom Widgets

class Widget {
  static init() {
    Widget.initImageButton();
    Widget.initTextButton();
    Widget.initIconSelectMenu();
    Widget.initToggleButton();
  }

  static initTextButton() {
    $.widget('namenote.textButton', {
      options: {
        float: 'left',
        height: '24px',
        locked: false
      },

      _create: function () {
        this.element.addClass('text-button');
        this.locked(this.options.locked);
        this.element.text(this.options.text);

        if (this.options.float) {
          this.element.css('float', this.options.float);
        }
        if (this.options.click) {
          this.element.on('click', this.options.click);
        }
        if (this.options.dblclick) {
          this.element.on('dblclick', this.options.dblclick);
        }
      },

      locked: function (value) {
        if (value === undefined) return this.options.locked;

        this.options.locked = value;
        if (value) {
          this.element.addClass('locked');
        } else {
          this.element.removeClass('locked');
        }
        return value;
      }
    });
  }

  static initImageButton() {
    $.widget('namenote.imageButton', {
      options: {
        float: 'left',
        width: '28px',
        height: '28px',
        locked: false,
        disabled: false
      },

      _create: function () {
        this.element.css('float', this.options.float);
        this.element.css('width', this.options.width);
        this.element.css('height', this.options.height);

        this.element.attr('title', T(this.element.attr('title')));
        this.element.html(`<img src='${this.options.src}' />`);

        this.locked(this.options.locked);
        this.disabled(this.options.disabled);

        if (this.options.content) {
          const content = this.options.content;
          content.title = '';
          if (this.options.float === 'right') {
            content.style.right = '0';
          }
          const parent = this.options.contentParent || this.element[0];
          parent.appendChild(content);

          if (this.options.contentParent) {
          // Should recalc menu postion on open
          }
        }

        const click = this.options.click;
        if (click) this.element.on('click', click);
      },

      locked: function (value) {
        if (value === undefined) return this.options.locked;

        this.options.locked = value;
        if (value) {
          this.element.addClass('locked');
        } else {
          this.element.removeClass('locked');
        }
        return value;
      },

      disabled: function (value) {
        if (value === undefined) return this.options.disabled;

        this.options.disabled = value;
        if (value) {
          this.element.addClass('off');
        } else {
          this.element.removeClass('off');
        }
        return value;
      },

      updateContentPosition: function () {
        const rect = this.element[0].getBoundingClientRect();
        const content = this.options.content;
        const contentWidth = this.options.contentWidth || 200; // for sidebar-menu

        const width = document.body.clientWidth;
        const left = (rect.x + contentWidth) < width ? rect.x : width - contentWidth;
        content.style.left = (left - 2) + 'px';
        content.style.top = (64 + 2) + 'px';
      }
    });
  }

  static initIconSelectMenu() {
    $.widget('namenote.iconselectmenu', $.ui.selectmenu, {
      _renderItem: function (ul, item) {
        var li = $('<li>');
        var wrapper = $('<div>', { text: item.label });

        if (item.disabled) {
          li.addClass('ui-state-disabled border-top');
        }

        if (item.element.attr('data-class')) {
          $('<span>', {
            style: item.element.attr('data-style'),
            class: 'ui-icon ' + item.element.attr('data-class')
          }).appendTo(wrapper);
        }

        return li.append(wrapper).appendTo(ul);
      }
    });
  }

  static initToggleButton() {
    $.widget('namenote.toggleButton', {
      options: {
        open: false
      },

      _create: function () {
        this.element.addClass('toggle-button');
        this.element.html('<span class="ui-icon ui-icon-caret-1-s"></span>');

        this.open(this.options.autoOpen);

        const click = this.options.click;
        if (click) this.element.on('click', click);
      },

      open: function (value) {
        if (value === undefined) return this.options.open;

        this.options.open = value;
        if (value) {
          this.element.html('<span class="ui-icon ui-icon-caret-1-n"></span>');
        } else {
          this.element.html('<span class="ui-icon ui-icon-caret-1-s"></span>');
        }
        return value;
      }
    });
  }

  static createImageButton(option) {
    const li = document.createElement('li');
    li.className = 'img-button';
    $(li).imageButton(option);
    return li;
  }
}

export { Widget };
