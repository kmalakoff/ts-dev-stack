#!/usr/bin/env node

const path = require('path');
const spawn = require('cross-spawn-cb');

const dirname = __dirname;
const src = path.resolve(dirname, '..', 'src', 'index.mjs');
const dest = path.join(dirname, '..', 'assets', 'tsds-lib.js');

function build(callback) {
  const config = path.resolve(__dirname, 'rollup.config.mjs');
  const args = ['rollup', '--config', config, '--input', src, '--file', dest];
  spawn(args[0], args.slice(1), { cwd: path.dirname(dirname), stdio: 'inherit' }, callback)
}

build((err) => {
  !err || console.error(err);
});
