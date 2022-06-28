var path = require('path');
var mkdirp = require('mkdirp');
var Queue = require('queue-cb');
var Iterator = require('fs-iterator');
var baseConfigSWC = require('../../../lib/baseConfigSWC');
var compileFile = require('./compileFile');
var assign = require('just-extend');

var TYPE_TO_FORMAT = {
  commonjs: 'cjs',
  es6: 'esm',
  umd: 'umd',
};

module.exports = function swc(options, cb) {
  var cwd = options.cwd || process.cwd();
  var fullSource = path.resolve(cwd, options.src);
  options = assign({}, options);
  options.dist = path.resolve(cwd, 'dist', TYPE_TO_FORMAT[options.type]);
  options.baseConfig = baseConfigSWC(options);
  options.sourceMaps = true;

  var queue = new Queue(1);
  queue.defer(function (cb) {
    mkdirp(options.dist, function () {
      cb();
    });
  });
  queue.defer(function (cb) {
    var iterator = new Iterator(path.dirname(fullSource));
    iterator.forEach(
      (entry, callback) => {
        if (!entry.stats.isFile()) return callback();
        compileFile(entry, options, callback);
      },
      { callbacks: true, concurrency: 1024 },
      cb
    );
    // }
  });
  queue.await(cb);
};
