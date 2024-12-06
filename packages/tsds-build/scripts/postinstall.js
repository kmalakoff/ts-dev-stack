#!/usr/bin/env node

const path = require('path');
const spawn = require('cross-spawn-cb');
const exit = require('exit');

function patch(callback) {
  let patchPath;
  try {
    patchPath = path.dirname(require.resolve('@swc/core/package.json'));
  } catch (_err) {
    return callback(new Error('@swc/core not found. Skipping patch'));
  }

  spawn('npm', ['install', 'install', '--omit=dev'], { cwd: patchPath, stdio: 'inherit' }, callback);
}

// run patch
patch((err) => {
  if (!err) return;
  console.error(err.message);
  return exit(1);
});
