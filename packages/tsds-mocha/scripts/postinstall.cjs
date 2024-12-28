#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const Queue = require('queue-cb');
const unixify = require('unixify');
const { whichAll } = require('tsds-lib');

const FILES = ['lib/cli/lookup-files.js'];

function patch(callback) {
  whichAll(['mocha', 'mocha-compat'], {}, (err, results) => {
    if (err) return callback(err);
    const patchPath = path.join(results[0], '..', 'mocha');
    const mochaCompatPath = path.join(results[0], '..', 'mocha-compat');

    const queue = new Queue();
    FILES.map((file) => {
      queue.defer((cb) => {
        try {
          const filePath = path.join.apply(null, [patchPath].concat(file.split('/')));
          const contents = fs.readFileSync(filePath, 'utf8');
          const newContents = contents.replace("require('glob')", `require('${unixify(path.relative(path.dirname(filePath), mochaCompatPath))}')`);
          if (contents === newContents) return cb(); // no change
          fs.writeFileSync(filePath, newContents, 'utf8');
          console.log(`Patched glob in: ${filePath}`);
          cb();
        } catch (err) {
          return callback(err);
        }
      });
    });
    queue.await(callback);
  });
}

// run patch
patch((err) => {
  !err || console.log(err.message);
  process.exit(0);
});
