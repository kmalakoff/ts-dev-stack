var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var Queue = require('queue-cb');
var assign = require('just-extend');
var compileDirectory = require('../lib/compileDirectory');

module.exports = function esm(_args, options, cb) {
  var cwd = options.cwd || process.cwd();
  options = assign({}, options);
  options.type = 'esm';
  options.sourceMaps = true;
  options.dest = path.join(cwd, 'dist', 'esm');
  rimraf(options.dest, function () {
    var queue = new Queue(1);
    queue.defer(compileDirectory.bind(null, options));
    queue.defer(fs.writeFile.bind(null, path.join(options.dest, 'package.json'), '{"type":"module"}'));
    queue.await(cb);
  });
};
