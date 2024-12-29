#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const Queue = require('queue-cb');
const unixify = require('unixify');
const resolve = require('resolve');

function patchGlob(mocha, mochaCompat, callback) {
  const filePath = path.join(mocha, 'lib', 'cli', 'lookup-files.js');
  const mochaCompatPath = path.join(mochaCompat, 'vendor', 'glob');
  const find = "require('glob')";
  const replace = `require('${unixify(path.relative(path.dirname(filePath), mochaCompatPath))}')`;

  fs.readFile(filePath, 'utf8', (err, contents) => {
    if (err) return callback(err);
    const newContents = contents.replace(find, replace);
    if (contents === newContents) return callback(); // no change
    fs.writeFile(filePath, newContents, 'utf8', (err) => {
      if (err) return callback(err);
      console.log(`Patched glob in: ${filePath}`);
      callback();
    });
  });
}

function patch(callback) {
  try {
    const mocha = path.dirname(resolve.sync('mocha/package.json'));
    const mochaCompat = path.dirname(resolve.sync('mocha-compat/package.json'));

    const queue = new Queue();
    queue.defer(patchGlob.bind(null, mocha, mochaCompat));
    queue.await(callback);
  } catch (err) {
    return callback(err);
  }
}

// run patch
patch((err) => {
  !err || console.log(err.message);
  process.exit(0);
});
