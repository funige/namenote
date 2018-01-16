To change app's version use "script/version [version string]".
Version string should be like "x.x.x" or "x.x.x-debug".

To make Namenote.zip and Namenote-trial.zip, you should follow this:
(1) On Windows, run "ruby script/package-win".
(2) Somehow copy Namenote/win.zip and Namenote-trial/win.zip to MacOS.
(3) On MacOS, run "script/package-mac".
(4) Then, run this script "script/publish".

Namenote.zip
  win.zip
  mac.zip
  __README__.txt
  __HISTORY__.txt
  __SHORTCUT__.txt

Namenote-trial.zip
  win.zip
  mac.zip
  __README__.txt
  __HISTORY__.txt
  __SHORTCUT__.txt

