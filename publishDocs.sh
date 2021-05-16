#! /usr/bin/env bash

npm run self-doc

if [ ! -d "ghpages" ]; then
    git clone https://github.com/neozenith/typedoc-plugin-missing-check ghpages/
fi

cd ghpages

git checkout docs

cp -R ../docs/* .

git add .
git commit -m "Updated docs"
git push origin docs

cd ..
