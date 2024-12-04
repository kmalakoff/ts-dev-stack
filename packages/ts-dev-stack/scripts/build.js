#!/usr/bin/env node

var tsds = require('./lib/ts-dev-stack.js')

tsds.build(null, {}, (err) => { 
  !err || console.error(err);
})

