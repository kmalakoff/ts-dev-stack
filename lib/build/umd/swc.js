var path = require('path');
var ts = require('ts-constants');

// var needsCompile = require('ts-swc-loaders/lib/needsCompile.js');
var readConfigSync = require('ts-swc-loaders/lib/readConfigSync.js');
var transformSync = require('ts-swc-loaders/lib/transformSync.js');

var config = readConfigSync(path.resolve(process.cwd(), 'tsconfig.json'));
config.options.target = ts.ScriptTarget.ES5;

module.exports = function swcPlugin() {
  return {
    name: 'swc',
    transform(contents, filename) {
      // TODO: test includes works:
      // "include": ["src", "test", "node_modules/index-of-newline"]
      // if (!needsCompile(filename, config)) return null;

      return transformSync(contents, filename, config.options);
    },
  };
};
