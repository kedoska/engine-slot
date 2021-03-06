#!/bin/bash
ORIGIN=$(pwd)
npm run format

if output=$(git status --porcelain) && [ "$output" ]; then
  >&2 echo "Uncommitted changes"
  exit 1
fi

npm run test-engine || exit 1
npm run lint || exit 1

npm run build

ENGINE=./dist/lib
cp ./README.md $ENGINE
cp ./package-engine.json $ENGINE/package.json
cd $ENGINE
echo entering `pwd`
npm publish

rm -rf ./dist/