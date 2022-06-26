/* eslint-disable @typescript-eslint/no-var-requires */
var path = require('path');
var rimraf = require('rimraf');
var Queue = require('queue-cb');
var assign = require('just-extend');
var spawn = require('../lib/spawn');

module.exports = function c8(_args, options, cb) {
  options = assign({}, options);
  var src = _args.length ? _args[0] : 'src/index.ts';
  options.src = path.join.apply(path, [process.cwd()].concat(src.split('/')));

  var queue = new Queue(1);
  queue.defer(function (cb) {
    rimraf(path.resolve(process.cwd(), 'docs'), function () {
      cb();
    });
  });
  queue.defer(function (cb) {
    var args = ['--includeVersion', '--entryPointStrategy', 'expand', '--out', 'docs'];
    args = args.concat(_args.length ? _args.slice(-1) : [options.src]);
    spawn('typedoc', args, { env: { BABEL_ENV: 'test' } }, cb);
  });
  queue.await(cb);
};
