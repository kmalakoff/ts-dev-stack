#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const Queue = require('queue-cb');
const unixify = require('unixify');
const whichAll = require('module-which').whichAll;

const FILES = ['lib/cli/lookup-files.js'];

function findNodeModules(found) {
  const foundParts = found.split(path.sep);
  while (foundParts.length) {
    if (foundParts[foundParts.length - 1] === 'node_modules') return foundParts.join(path.sep);
    // global install
    if (foundParts[foundParts.length - 1] === 'bin') return foundParts.slice(0, -1).concat(['lib', 'node_modules']).join(path.sep);
    foundParts.pop();
  }
  throw new Error('node_modules not found');
}

function patch(callback) {
  whichAll(['mocha', 'mocha-compat'], {}, (err, results) => {
    if (err) return callback(err);
    try {
      const patchPath = path.join(findNodeModules(results[0]), 'mocha');
      const mochaCompatPath = path.join(findNodeModules(results[1]), 'mocha-compat', 'vendor', 'glob');

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
    } catch (err) {
      return callback(err);
    }
  });
}

// run patch
patch((err) => {
  !err || console.log(err.message);
  process.exit(0);
});
