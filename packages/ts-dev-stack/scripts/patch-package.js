#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

const FILES = ['lib/cli/lookup-files.js'];

function patch() {
  const mochaPath = path.dirname(require.resolve('mocha/package.json'));
  const mochaCompatPath = path.dirname(require.resolve('mocha-compat/package.json'));
  if (!mochaPath) return console.log('mocha not found. Skipping patch');
  if (!mochaCompatPath) return console.log('mocha-compat not found. Skipping patch');

  for (let i = 0; i < FILES.length; i++) {
    const filePath = path.join.apply(null, [mochaPath].concat(FILES[i].split('/')));
    const contents = fs.readFileSync(filePath, 'utf8');
    const newContents = contents.replace("require('glob')", "require('mocha-compat/vendor/glob/glob.js')");
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
