#!/bin/bash

#
# Trial
#
# script/trial.sh true
# (wait gulp)
# script/package-trial.sh
#

echo "checking trial..."
script/trial.sh || exit

echo "*packaging trial version..."
################################################################

echo "packaging for macos..."
electron-packager ./app --overwrite --platform=darwin --arch=x64 --icon=assets/icons/namenote.icns --prune=true --out=release-builds --ignore='es6/.*\.es6'

echo "packageing for win32..."
electron-packager ./app --overwrite --platform=win32 --arch=ia32 --icon=assets/icons/namenote.ico --prune=true --out=release-builds --ignore='es6/.*\.es6'

echo "ditto for macos..."
ditto -c -k --sequesterRsrc --keepParent release-builds/Namenote-darwin-x64 ./Namenote-trial/mac.zip 

echo "ditto for win32..."
ditto -c -k --sequesterRsrc --keepParent release-builds/Namenote-win32-ia32 ./Namenote-trial/win.zip 

echo "zip files..."
ditto -c -k --sequesterRsrc --keepParent Namenote-trial Namenote-trial.zip 
zip -d Namenote-trial.zip '__MACOSX*'
zip -d Namenote-trial.zip '*.DS_Store'

echo "done."
