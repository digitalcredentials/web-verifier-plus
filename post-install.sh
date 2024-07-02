#!/bin/sh

npx patch-package
cd node_modules/@digitalbazaar/http-client
npm i -fD @rollup/plugin-node-resolve
npm run rebuild
cd -
