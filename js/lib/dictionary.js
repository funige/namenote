'use strict';

const dictionary = {
  "ja": {
    "Namenote": "Namenote",
    "About Namenote": "Namenote について",
    "About Namenote ...": "Namenote について ...",
    "Help": "ヘルプ",
    "Settings": "環境設定",
    "Settings ...": "環境設定 ...",
    "Tablet Settings": "筆圧調整",
    "Tablet Settings ...": "筆圧調整 ...",
    "Quit Namenote": "Namenote を終了",
    "File Manager ...": "ファイルマネージャー ...",
    "Note": "ノート",
    "File": "ファイル",
    "Open ...": "開く ...",
    "Open": "ノートを開く",
    "New ...": "新規 ...",
    "New": "新規ノート",
    "Close": "閉じる",
    "Close All": "すべてを閉じる",
    "Note Settings ...": "ノート設定 ...",
    "Export": "書き出し",
    "Export CSNF ...": "CSNF書き出し ...",
    "Export PDF ...": "PDF書き出し ...",
    "Import": "読み込み",
    ".csnf (CLIP STUDIO Storyboard) ...": ".csnf (CLIP STUDIO ネームファイル) ...",
    ".pdf (PDF) ...": ".pdf (PDF) ...",
    ".txt (Plain Text) ...": ".txt (テキストファイル) ...",
    "Save": "保存",
    "Save As ...": "名前をつけて保存 ...",
    "Save As": "名前をつけて保存",
    "Save Snapshot As ...": "バックアップを保存 ...",
    "Edit": "編集",
    "Undo": "取り消し",
    "Redo": "やり直し",
    "Cut": "切り取り",
    "Copy": "コピー",
    "Paste": "貼り付け",
    "Select All": "すべてを選択",

    "Page": "ページ",
    "Add": "追加",
    "Remove": "削除",
    "Duplicate": "複製",
    "Move to Buffer": "バッファに入れる",
    "Put Back from Buffer": "バッファから戻す",
    "Empty Buffer": "バッファを空にする",
    "Move Forward": "前に移動",
    "Move Backward": "後ろに移動",
    "Flip": "左右反転して表示",
    "Save Image As ...": "イメージを保存 ...",
    "Save Image": "イメージを保存",
    "Download": "ダウンロード",
    "Download Image": "イメージを保存",
    "Repaint": "再描画",
    
    "Untitled": "名称未設定",
    "View": "表示",
    "Tool Bar": "ツールバー",
    "Dock": "サイドバー",
    "Developer Tools": "デベロッパー ツール",
    "Full Screen": "フルスクリーン",
    "Multipage": "複数ページ表示",
    "Print Preview": "印刷プレビュー",
    "Thumbnail Size": "サムネールのサイズ",
    "Small": "小",
    "Middle": "中",
    "Large": "大",
    "Font Size": "フォントのサイズ",
    
    "Window": "ウィンドウ",
    "Extract Text": "テキストを抽出",
    "Open Recent": "最近使用したノートを開く",
    "Clear Recent Note List": "最近使用したノートのリストを消去",
    "Untitled": "名称未設定",
    "Making CSNF ...": "CSNFファイルを作成中 ...",
    "Making PDF ...": "PDFファイルを作成中 ...",
    "Online Storage": "オンラインストレージ",
    "Recent Notes": "最近使用したノート",

    "Namenote would like access to the files in your Dropbox.": "Namenote は Dropbox にデータを保存します。<br>接続しますか？",
    "Authenticate": "認証",
    "Connect to Dropbox": "Dropbox に接続",
    "Cancel": "キャンセル",
    "Abort": "中断",
    "Connecting ...": "接続中 ...",
    "Loading ...": "読み込み中 ...",
    "Logout": "ログアウト",
    "Disconnected.": "接続を解除しました。",
    
    "Texts": "テキスト",
    "Notes": "ノート",

    "Dock Side": "サイドバーの位置",
    "Left": "左",
    "Right": "右",

    "Pressure": "筆圧",
    "Vertical": "縦書き",
    "Horizontal": "横書き",

    "New notebook": "新規ノート",
    "Notebook name": "ノート名",
    "Location": "場所",
    "Choose folder...": "参照...",
    "Number of pages": "ページ数",
    "Template": "テンプレート",
    "Manga": "漫画",
    "Binding point": "綴じる位置",
    "Left binding": "左綴じ　",
    "Right binding": "右綴じ　",
    "Start page": "開始ページ",
    "From left": "左ページ",
    "From right": "右ページ",
    "Pages": "ページ",
    "pages": "ページ",
    "All": "すべて",
    "Current page": "選択されたページ",
    "Range": "範囲指定",
    "Scale": "拡大/縮小",
    "Custom": "カスタム",
    "Text color": "テキストの色",
    "100%": "B5商業誌用(B4サイズ原稿用紙/A4仕上がり)",
    "82%": "A5同人誌用(A4サイズ原稿用紙/B5仕上がり)",
    "Name changer compatible": "ストーリーエディタ用ネームチェンジャー互換",

    "Export CLIP STUDIO Storyboard": "CLIP STUDIO ネーム書き出し",
    "Export PDF": "PDF書き出し",
    "Import Plain Text": "テキスト読み込み",
    "Reset Settings to Default": "初期設定に戻す",

    "File name": "ファイル名",
    "Duplicate note name.": "同じ名前のノートがあります。",
    "Duplicate file name.": "同じ名前のファイルがあります。",
    "File not found.": "ファイルが見つかりません。",
    "File open error.": "このファイルは開けません。",
    "Folder open error.": "このフォルダは開けません。",
    "Save error.": "セーブできません。",
    "Network error.": "ネットワークに接続できません。",
    "Too many files in this folder.": "ファイルが多すぎます。",
    
    "Select file to import": "読み込むファイルを選択してください",
    "Compressing": "圧縮中",
    "Rendering": "作成中",

    "Format": "フォーマット",
    "Line separator": "改行",
    "Balloon separator": "改セリフ",
    "Page separator": "改ページ",
    "Comment key": "コメント",
    "Choose file...": "ファイルを選択...",
    
    "Trial": "試用版",
    "Welcome to the trial version of Namenote.\nYou have ": "あと",
    " day(s) left.": "日ぐらい試用できます。\nありがとうございます！", 
    "We're sorry, but your trial period has expired.": "試用期間終了しました。\nありがとうございました！", 

    "Zoom small texts on input": "小さいテキストを編集するときは拡大表示する",
    "Use Quickline" : "長押しで直線ツールに切り替える",
    "Disable wintab driver": "Wintabドライバを使わない",
    "Disable mouse wheel scroll": "マウスホイールでスクロールしない",
    "Click OK to restore default settings.": "デフォルトの設定に戻します",
    "Pen pressure": "筆圧",
    "Output": "出力",

    "Menu": "メニュー",
    "Pen": "ペン",
    "Eraser": "消しゴム",
    "Text": "テキスト",
    "Zoom In": "ズームイン",
    "Zoom Out": "ズームアウト",
    "Quick Zoom": "クイックズーム",

    "Write Protected": "書き込み禁止",
    "Write Protect": "書き込み禁止",
    
    
    "Enable Japanese Options": "日本語用のオプションを有効にする"
  }
}

exports.dictionary = dictionary
