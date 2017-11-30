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

cd release-builds
echo "zip for macos..."
zip -qyr ../Namenote-trial/mac.zip Namenote-darwin-x64 -x *.DS_Store

echo "zip for win32..."
zip -qr ../Namenote-trial/win.zip Namenote-win32-ia32 -x *.DS_Store

cd ..
zip -qr Namenote-trial.zip Namenote-trial -x *.DS_Store

echo "done."
