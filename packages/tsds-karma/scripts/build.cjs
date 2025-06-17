#!/usr/bin/env node

const spawn = require('cross-spawn-cb');
const path = require('path');

const isWindows = process.platform === 'win32' || /^(msys|cygwin)$/.test(process.env.OSTYPE);
const bin = isWindows ? process.env.npm_config_prefix : path.join(process.env.npm_config_prefix, 'bin');

spawn(path.join(bin, 'tsds'), ['build'], { cwd: process.cwd(), stdio: 'inherit' }, function (err) {
  process.exit(err ? 1 : 0);
});
