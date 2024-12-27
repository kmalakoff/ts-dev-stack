#!/usr/bin/env node

import build from '../assets/tsds-build.js';

build(null, {}, (err) => {
  !err || console.log(err.message);
  process.exit(err ? 1 : 0);
});
