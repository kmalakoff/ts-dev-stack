var path = require('path');
var Iterator = require('fs-iterator');
var assign = require('just-extend');
var readConfigSync = require('ts-swc-loaders/lib/readConfigSync.js');
var needsCompile = require('ts-swc-loaders/lib/needsCompile.js');

var source = require('../lib/source');
var compileFile = require('./compileFile');

module.exports = function compileDirectory(options, cb) {
  var cwd = options.cwd || process.cwd();
  var src = source(options);
  var srcFolder = path.dirname(path.resolve(cwd, src));

  var config = readConfigSync(path.resolve(cwd, 'tsconfig.json'));
  options = assign({}, options, { compilerOptions: config.options || {} });
  var iterator = new Iterator(srcFolder);
  iterator.forEach(
    function (entry, callback) {
      if (!entry.stats.isFile()) return callback();
      if (!needsCompile(entry.fullPath, config)) return callback();
      compileFile(entry, options, callback);
    },
    { callbacks: true, concurrency: 1024 },
    cb
  );
};
