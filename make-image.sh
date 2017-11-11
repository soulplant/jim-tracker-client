#!/bin/bash

set -e

PKG=pkg
SERVER_DIR="$GOPATH/src/github.com/soulplant/talk-tracker"
echo "building server..."
(cd $SERVER_DIR; env GOOS=linux GOARCH=386 go build)

echo "building client..."
yarn build

rm -rf $PKG
mkdir $PKG
# cp -r $SERVER_DIR $PKG/src
cp $SERVER_DIR/talk-tracker $PKG/talk-tracker
cp -r build $PKG
cp Dockerfile $PKG
cp $SERVER_DIR/talk-tracker $PKG
docker build $PKG -t talk-tracker

# TODO(james): Make the label configurable.
docker tag talk-tracker asia.gcr.io/helix-sydney/talk-tracker:v1

echo "pushing v1 to gcr..."
gcloud docker -- push asia.gcr.io/helix-sydney/talk-tracker:v1
