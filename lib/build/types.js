var path = require('path');
var rimraf = require('rimraf');
var Iterator = require('fs-iterator');
var getTS = require('get-tsconfig-compat');
var createMatcher = require('ts-swc-loaders/lib/createMatcher.js');

var spawn = require('../lib/spawn');
var source = require('../lib/source');

module.exports = function types(_args, options, cb) {
  var cwd = options.cwd || process.cwd();
  var src = source(options);
  var srcFolder = path.dirname(path.resolve(cwd, src));
  var dest = path.join(cwd, 'dist', 'types');

  var config = getTS.getTsconfig(path.resolve(cwd, 'tsconfig.json'));
  var matcher = createMatcher(config);
  var tsArgs = [];
  for (var key in config.config.compilerOptions) {
    var value = config.config.compilerOptions[key];
    tsArgs.push('--' + key);
    tsArgs.push(Array.isArray(value) ? value.join(',') : value);
  }

  rimraf(dest, function () {
    var iterator = new Iterator(srcFolder);
    iterator.forEach(
      function (entry, callback) {
        if (!entry.stats.isFile()) return callback();
        if (!matcher(entry.fullPath)) return callback();
        var args = [entry.fullPath, '--declaration', '--emitDeclarationOnly', '--outDir', dest].concat(tsArgs);
        spawn('tsc', args, { cwd: cwd }, callback);
      },
      { callbacks: true, concurrency: 1024 },
      cb
    );
  });
};
