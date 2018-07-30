'use strict'

import { locale } from './locale.es6'
import { helper } from './helper.es6'


const aboutDialog = {
  id: 'about-dialog',
  element: null,
  
  init: (version) => {
    $('#about-dialog').dialog({
      autoOpen: true,
      position: { at:'center top+150px' },
      title: T('About Namenote'),
      modal: true,
      width: 600,
      buttons: { Ok: aboutDialog.ok },
    })

    const string = locale.translateHTML(`
    <center>
      <img src='./img/namenote1024.png' width="100px" />
      <br>
      Namenote v${namenote.version}
      <br><br>
      <small>Copyright (c) Funige</small></center>
    <br><hr>
    開発中のネームエディタです。
    <br><br>

    <table>
      <tr><td>ペン・消しゴム切替&nbsp;<td>C</tr>
      <tr><td>ズーム<td>Space</tr>
      <tr><td>テキストの追加<td>Ctrl+クリック</tr>
      <tr><td>テキストの削除<td>Del</tr>
      <tr><td>入力モードの切替<td>Ctrl+G</tr>

      <tr><td>&nbsp;<td></tr>
      <tr><td>縦書き・横書き切替　<td>Ctrl+]</tr>
      <tr><td>フォント縮小<td>Ctrl+,(カンマ)</tr>
      <tr><td>フォント拡大<td>Ctrl+.(ピリオド)</tr>
    </table>`
    )
    
    $('#about-dialog').html(string)
  },

  ok: () => {
    helper.closeDialog(aboutDialog)
    return false
  },
  
  show: () => {
    helper.openDialog(aboutDialog)
  },
}


export { aboutDialog }
