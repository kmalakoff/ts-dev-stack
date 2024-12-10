#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const spawn = require('cross-spawn-cb');

const dirname = __dirname;
const src = path.resolve(dirname, '..', 'src', 'index.mjs');
const dest = path.join(dirname, '..', 'assets', 'tsds-build.js');

function replace(callback) {
  try {
    let contents = fs.readFileSync(dest, 'utf8');
    contents = contents.replace(/tsds-lib/g, 'tsds-lib/assets/tsds-lib.js');
    fs.writeFileSync(dest, contents, 'utf8');
    callback();
  } catch (err) {
    return callback(err);
  }
}

function build(callback) {
  const config = path.resolve(__dirname, 'rollup.config.mjs');
  const args = ['rollup', '--config', config, '--input', src, '--file', dest];
  spawn(args[0], args.slice(1), { cwd: path.dirname(dirname), stdio: 'inherit' }, (err) => {
    err ? callback(err) : replace(callback);
  });
}

build((err) => {
  !err || console.error(err);
});
