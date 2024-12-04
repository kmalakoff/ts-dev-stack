#!/usr/bin/env node

var path = require('path');
var fs = require('fs');

var FILES = ['lib/cli/lookup-files.js'];

function patch() {
  var mochaPath = path.dirname(require.resolve('mocha/package.json'));
  var mochaCompatPath = path.dirname(require.resolve('mocha-compat/package.json'));
  if (!mochaPath) return console.log('mocha not found. Skipping patch');
  if (!mochaCompatPath) return console.log('mocha-compat not found. Skipping patch');

  for (let i = 0; i < FILES.length; i++) {
    var filePath = path.join.apply(null, [mochaPath].concat(FILES[i].split('/')));
    var contents = fs.readFileSync(filePath, 'utf8');
    var newContents = contents.replace("require('glob')", "require('mocha-compat/vendor/glob/glob.js')");
    if (contents !== newContents) {
      fs.writeFileSync(filePath, newContents, 'utf8');
      console.log(`Patched glob in: ${filePath}`);
    }
  }
}

// run patch
try {
  patch();
} catch (err) {
  console.error(err.message);
}
