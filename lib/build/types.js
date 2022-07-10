var path = require('path');
var rimraf = require('rimraf');
var Iterator = require('fs-iterator');
var spawn = require('../lib/spawn');

var source = require('../lib/source');
var needsCompile = require('../lib/swc-register/needsCompile');

var call = require('node-version-call');
var major = +process.versions.node.split('.')[0];
var version = major >= 12 ? 'local' : 'lts';
var tsConfigRead = path.dirname(__dirname) + '/lib/tsconfig-read-es6';

module.exports = function types(_args, options, cb) {
  var cwd = options.cwd || process.cwd();
  var src = source(options);
  var srcFolder = path.dirname(path.resolve(cwd, src));
  var dest = path.join(cwd, 'dist', 'types');

  var tsConfig = call(version, tsConfigRead, path.resolve(cwd, 'tsconfig.json'));
  var tsArgs = [];
  for (var key in tsConfig.raw.compilerOptions) {
    var value = tsConfig.raw.compilerOptions[key];
    tsArgs.push('--' + key);
    tsArgs.push(Array.isArray(value) ? value.join(',') : value);
  }

  rimraf(dest, function () {
    var iterator = new Iterator(srcFolder);
    iterator.forEach(
      function (entry, callback) {
        if (!entry.stats.isFile()) return callback();
        if (!needsCompile(entry.fullPath, tsConfig)) return callback();
        var args = [entry.fullPath, '--declaration', '--emitDeclarationOnly', '--outDir', dest].concat(tsArgs);
        spawn('tsc', args, { cwd: cwd }, callback);
      },
      { callbacks: true, concurrency: 1024 },
      cb
    );
  });
};
