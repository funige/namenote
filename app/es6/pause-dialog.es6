'use strict'

const pauseDialog = {
  init: () => {
    $('#pause-dialog').dialog({
      autoOpen: false,
      modal: true,
      buttons: {
        Ok: function() { $(this).dialog('close') },
      },
    })
  },

  show: () => {
    $('#pause-dialog').dialog('open')
  },
}


export { pauseDialog }
