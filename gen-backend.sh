#!/bin/bash

set -x

cd "$(dirname "$0")"

TMP_DIR=gen_tmp
OUT_DIR=src/backend

rm -rf gen_tmp
rm -rf OUT_DIR
mkdir gen_tmp

swagger-codegen generate -i $GOPATH/src/github.com/soulplant/talk-tracker/api/api.swagger.json -l typescript-fetch -o gen_tmp

cp $TMP_DIR/api.ts $OUT_DIR
rm -rf $TMP_DIR

sed -i '' /querystring/d $OUT_DIR/api.ts

# No harm in keeping a fetch polyfill. Also, the fix is more involved than
# these two simple lines because there are naming conflicts with the variable
# fetch.
# sed -i '' /^import.*isomorphicFetch/d $OUT_DIR/api.ts
# sed -i '' s/isomorphicFetch/fetch/g $OUT_DIR/api.ts
