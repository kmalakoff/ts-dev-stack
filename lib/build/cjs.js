var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var Queue = require('queue-cb');
var assign = require('just-extend');
var compileDirectory = require('../lib/compileDirectory');

module.exports = function cjs(_args, options, cb) {
  var cwd = options.cwd || process.cwd();
  options = assign({}, options);
  options.type = 'cjs';
  options.sourceMaps = true;
  options.dest = path.join(cwd, 'dist', 'cjs');
  rimraf(options.dest, function () {
    var queue = new Queue(1);
    queue.defer(compileDirectory.bind(null, options));
    queue.defer(fs.writeFile.bind(null, path.join(options.dest, 'package.json'), '{"type":"commonjs"}'));
    queue.await(cb);
  });
};
