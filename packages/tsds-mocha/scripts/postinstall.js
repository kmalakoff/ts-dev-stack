#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const Queue = require('queue-cb');
const unixify = require('unixify');
const exit = require('exit');

const FILES = ['lib/cli/lookup-files.js'];

function patch(callback) {
  let patchPath;
  try {
    patchPath = path.dirname(require.resolve('mocha/package.json'));
  } catch (_err) {
    return callback(new Error('mocha not found. Skipping patch'));
  }
  let mochaCompatPath;
  try {
    mochaCompatPath = path.dirname(require.resolve('mocha-compat/vendor/glob/glob.js'));
  } catch (_err) {
    return callback(new Error('mocha-compat not found. Skipping patch'));
  }

  const queue = new Queue();
  FILES.map((file) => {
    queue.defer((cb) => {
      const filePath = path.join.apply(null, [patchPath].concat(file.split('/')));
      const contents = fs.readFileSync(filePath, 'utf8');
      const newContents = contents.replace("require('glob')", `require('${unixify(path.relative(filePath, mochaCompatPath))}')`);
      if (contents === newContents) return cb(); // no change
      fs.writeFileSync(filePath, newContents, 'utf8');
      console.log(`Patched glob in: ${filePath}`);
      cb();
    });
  });
  queue.await(callback);
}

// run patch
patch((err) => {
  if (!err) return;
  console.error(err.message);
  return exit(1);
});
