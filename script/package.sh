#!/bin/sh

#
# Release
#
# script/trial.sh false
# (wait gulp)
# script/package.sh
#

echo "checking trial..."
script/trial.sh && exit

echo "*packaging paid version..."
################################################################

echo "packaging for macos..."
electron-packager ./app --overwrite --platform=darwin --arch=x64 --icon=assets/icons/namenote.icns --prune=true --out=release-builds --ignore='es6/.*\.es6'

echo "packageing for win32..."
electron-packager ./app --overwrite --platform=win32 --arch=ia32 --icon=assets/icons/namenote.ico --prune=true --out=release-builds --ignore='es6/.*\.es6'

echo "ditto for macos..."
ditto -c -k --sequesterRsrc --keepParent release-builds/Namenote-darwin-x64 ./Namenote/mac.zip 

echo "ditto for win32..."
ditto -c -k --sequesterRsrc --keepParent release-builds/Namenote-win32-ia32 ./Namenote/win.zip 

echo "zip files..."
ditto -c -k --sequesterRsrc --keepParent Namenote Namenote.zip 
zip -d Namenote.zip '__MACOSX*'
zip -d Namenote.zip '*.DS_Store'

echo "done."
