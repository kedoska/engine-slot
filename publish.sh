#!/bin/bash

npm run format

if output=$(git status --porcelain) && [ "$output" ]; then
  >&2 echo "Uncommitted changes"
  exit 1
fi

npm run test || exit 1
npm run lint || exit 1

npm run build

DEST=./dist/lib
cp ./README.md $DEST
cp ./package-public.json $DEST/package.json
cd $DEST
echo entering `pwd`
npm publish

rm -rf ./dist/