var path = require('path');
var Iterator = require('fs-iterator');
var assign = require('just-extend');

var source = require('../lib/source');
var needsCompile = require('./swc-register/needsCompile');
var compileFile = require('./compileFile');

var major = +process.versions.node.split('.')[0];
var version = major >= 12 ? 'local' : 'lts';
var readConfig = path.join(__dirname, 'swc-register', 'readConfig.js');

var call = null; // break dependencies
module.exports = function compileDirectory(options, cb) {
  if (!call) call = require('node-version-call'); // break dependencies

  var cwd = options.cwd || process.cwd();
  var src = source(options);
  var srcFolder = path.dirname(path.resolve(cwd, src));

  var tsConfig = call(version, readConfig, path.resolve(cwd, 'tsconfig.json'));
  options = assign({}, options, { compilerOptions: tsConfig.options || {} });
  var iterator = new Iterator(srcFolder);
  iterator.forEach(
    function (entry, callback) {
      if (!entry.stats.isFile()) return callback();
      if (!needsCompile(entry.fullPath, tsConfig)) return callback();
      compileFile(entry, options, callback);
    },
    { callbacks: true, concurrency: 1024 },
    cb
  );
};
