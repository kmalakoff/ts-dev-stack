var path = require('path');
var rimraf = require('rimraf');
var spawn = require('../lib/spawn');
var source = require('../lib/source');

module.exports = function types(_args, options, cb) {
  var cwd = options.cwd || process.cwd();
  var src = source(options);
  var dest = path.join(cwd, 'dist', 'types');
  rimraf(dest, function () {
    var args = [src, '--declaration', '--emitDeclarationOnly', '--outDir', dest];

    tsConfig = require(path.join(cwd, 'tsconfig.json'));
    for (var key in tsConfig.compilerOptions) {
      var value = tsConfig.compilerOptions[key];
      args.push('--' + key)
      args.push(Array.isArray(value) ? value.join(',') : value)
    }
    spawn('tsc', args, {cwd: cwd}, cb);
  });
};
