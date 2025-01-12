#!/usr/bin/env node

const build = require('../assets/build.cjs');

build(null, {}, (err) => {
  !err || console.log(err.message);
  process.exit(err ? 1 : 0);
});
