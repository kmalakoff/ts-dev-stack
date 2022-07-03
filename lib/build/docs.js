var path = require('path');
var rimraf = require('rimraf');
var spawn = require('../lib/spawn');
var source = require('../lib/source');

module.exports = function docs(_args, options, cb) {
  var src = source(options);
  rimraf(path.resolve(process.cwd(), 'docs'), function () {
    var args = ['--includeVersion', '--entryPointStrategy', 'expand', '--out', 'docs'];
    args = args.concat(_args.length ? _args.slice(-1) : [src]);
    spawn('typedoc', args, {}, cb);
  });
};
