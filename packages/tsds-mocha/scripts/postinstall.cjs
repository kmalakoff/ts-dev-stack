#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
var unixify = require('unixify');
var resolve = require('resolve');

function patch(callback) {
  try {
    var mocha = path.dirname(resolve.sync('mocha/package.json'));
    var mochaCompat = path.dirname(resolve.sync('mocha-compat/package.json'));

    var filePath = fs.realpathSync(path.join(mocha, 'lib', 'cli', 'lookup-files.js'));
    var mochaCompatPath = fs.realpathSync(path.join(mochaCompat, 'vendor', 'glob'));
    var find = "require('glob')";
    var replace = `require('${unixify(path.relative(path.dirname(filePath), mochaCompatPath))}')`;

    fs.readFile(filePath, 'utf8', function (err, contents) {
      if (err) return callback(err);
      var newContents = contents.replace(find, replace);
      if (contents === newContents) return callback(); // no change
      fs.writeFile(filePath, newContents, 'utf8', function (err) {
        if (err) return callback(err);
        console.log(`Patched glob in: ${filePath}`);
        callback();
      });
    });
  } catch (err) {
    return callback(err);
  }
}

// run patch
patch(function (err) {
  if (err) {
    console.log(`postinstall failed. Error: ${err.message}`);
    process.exit(-1);
  } else {
    console.log('postinstall succeeded');
    process.exit(0);
  }
});
