var path = require('path');
var mkdirp = require('mkdirp');
var Queue = require('queue-cb');
var Iterator = require('fs-iterator');
var baseConfig = require('./baseConfig');
var bundleFile = require('./bundleFile');
var compileFile = require('./compileFile');
var assign = require('just-extend');
var camelcase = require('lodash.camelcase');

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
  options.baseConfig = baseConfig(options);
  options.sourceMaps = true;

  var queue = new Queue(1);
  queue.defer(function (cb) {
    mkdirp(options.dist, function () {
      cb();
    });
  });
  queue.defer(function (cb) {
    // if (options.type === 'umd') {
    //   var pkg = require(path.join(cwd, 'package.json'));
    //   var globals = {};
    //   if (pkg.dependencies) {
    //     for (var key in pkg.dependencies) {
    //       globals[key] = camelcase(key);
    //     }
    //   }
    //   options = assign({}, options, { globals: globals });
    //   var entry = {
    //     basename: path.basename(fullSource),
    //     fullPath: fullSource,
    //     path: pkg.name + '.js',
    //   };
    //   bundleFile(entry, options, cb);
    // } else {
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
