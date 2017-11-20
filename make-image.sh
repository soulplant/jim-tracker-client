#!/bin/bash

set -e

APP=jim-tracker
VERSION=v1

PKG=pkg
SERVER_DIR="$GOPATH/src/github.com/soulplant/$APP"
echo "building server..."
(cd $SERVER_DIR; env GOOS=linux GOARCH=386 go build)

echo "building client..."
yarn build

rm -rf $PKG
mkdir $PKG
# cp -r $SERVER_DIR $PKG/src
cp $SERVER_DIR/$APP $PKG/$APP
cp -r build $PKG
cp Dockerfile $PKG
cp $SERVER_DIR/$APP $PKG
docker build $PKG -t $APP

# TODO(james): Make the label configurable.
docker tag $APP asia.gcr.io/helix-sydney/$APP:$VERSION

echo "pushing $APP:$VERSION to gcr..."
gcloud docker -- push asia.gcr.io/helix-sydney/$APP:$VERSION
