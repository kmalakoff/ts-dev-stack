#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const Queue = require('queue-cb');
const unixify = require('unixify');
const _exit = require('exit');

const FILES = ['lib/cli/lookup-files.js'];

function patch(callback) {
  let patchPath;
  let mochaCompatPath;
  try {
    patchPath = path.dirname(require.resolve('mocha/package.json'));
    mochaCompatPath = require.resolve('mocha-compat/vendor/glob/glob.js');
  } catch (err) {
    return callback(err);
  }

  const queue = new Queue();
  FILES.map((file) => {
    queue.defer((cb) => {
      const filePath = path.join.apply(null, [patchPath].concat(file.split('/')));
      const contents = fs.readFileSync(filePath, 'utf8');
      const newContents = contents.replace("require('glob')", `require('${unixify(path.relative(path.dirname(filePath), mochaCompatPath))}')`);
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
  !err || console.log(err.message);
  process.exit(err ? 1 : 0);
});
