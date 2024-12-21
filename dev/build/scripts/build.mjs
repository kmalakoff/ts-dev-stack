#!/usr/bin/env node

import build from '../assets/tsds-build.cjs';

build(null, {}, (err) => {
  !err || console.error(err);
});