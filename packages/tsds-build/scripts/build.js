#!/usr/bin/env node

const build = require('../assets/tsds-build.js');

build(null, {}, (err) => {
  !err || console.error(err);
});
