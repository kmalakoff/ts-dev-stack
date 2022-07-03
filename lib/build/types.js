var path = require('path');
var rimraf = require('rimraf');
var spawn = require('../lib/spawn');

module.exports = function types(_args, options, cb) {
  var cwd = options.cwd || process.cwd();
  var dest = path.join(cwd, 'dist', 'types');
  rimraf(dest, function () {
    spawn('tsc', ['--declaration', '--emitDeclarationOnly', '--outDir', dest], {}, cb);
  });
};
