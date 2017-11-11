#!/bin/bash

set -x

cd "$(dirname "$0")"

TMP_DIR="$PWD/gen_tmp"
OUT_DIR="$PWD/src/backend"
API_DIR="$GOPATH/src/github.com/soulplant/jim-tracker/api"

rm -rf $TMP_DIR
rm -rf $OUT_DIR
mkdir $TMP_DIR
mkdir $OUT_DIR

docker run --rm \
  -v ${API_DIR}:/input \
  -v ${TMP_DIR}:/output \
  swaggerapi/swagger-codegen-cli generate \
  -i /input/api.swagger.json \
  -l typescript-fetch \
  -o /output

cp $TMP_DIR/*.ts $OUT_DIR
rm -rf $TMP_DIR
