#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
var unixify = require('unixify');
var resolve = require('resolve');
var Queue = require('queue-cb');

var MOCHAS = ['mocha-compat-esm', 'mocha'];

function patch(name, callback) {
  try {
    var mochaCompat = path.dirname(resolve.sync('mocha-compat/package.json'));
    var sourcePath = fs.realpathSync(path.join(mochaCompat, 'vendor', 'glob'));

    var patchPath = path.dirname(resolve.sync(`${name}/package.json`));

    var queue = new Queue();
    queue.defer((callback) => {
      var filePath = fs.realpathSync(path.join(patchPath, 'lib', 'cli', 'lookup-files.js'));
      var find = "require('glob')";
      var replace = `require('${unixify(path.relative(path.dirname(filePath), sourcePath))}')`;

      fs.readFile(filePath, 'utf8', (err, contents) => {
        if (err) return callback(err);
        var newContents = contents.replace(find, replace);
        if (contents === newContents) return callback(); // no change
        fs.writeFile(filePath, newContents, 'utf8', (err) => {
          if (err) return callback(err);
          console.log(`Patched glob in: ${filePath}`);
          callback();
        });
      });
    });
    name === 'mocha' ||
      queue.defer((callback) => {
        var filePath = path.join(patchPath, 'package.json');
        var pkg = require(filePath);
        if (pkg.bin[name] !== undefined) return callback();
        pkg.bin[name] = pkg.bin.mocha;
        fs.writeFile(filePath, JSON.stringify(pkg, null, 2), 'utf8', (err) => {
          if (err) return callback(err);
          console.log(`Patched bin in: ${filePath}`);
          callback();
        });
      });
    queue.await(callback);
  } catch (err) {
    return callback(err);
  }
}

// run patches
var queue = new Queue();
MOCHAS.forEach((name) => {
  queue.defer(patch.bind(null, name));
});
queue.await((err) => {
  if (err) {
    console.log(`postinstall failed. Error: ${err.message}`);
    process.exit(-1);
  } else {
    console.log('postinstall succeeded');
    process.exit(0);
  }
});
