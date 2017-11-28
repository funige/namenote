'use strict'

let button


const menuButton = {}

menuButton.init = () => {
  button = $('#menu-button').imgButton({
    src: 'img/autosave-button.png',
    float: 'right',
    click: function(e) {
      const element = $(e.target)
      if (!element.imgButton('disabled')) {
	element.imgButton('locked', !element.imgButton('locked'))
      }
    }
  })[0]
}

menuButton.update = () => {
}


export { menuButton }

