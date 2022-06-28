var path = require('path');
var rimraf = require('rimraf');
var Queue = require('queue-cb');

var link = require('../../lib/link');
var spawn = require('../../lib/spawn');

module.exports = function c8(_args, _options, cb) {
  var queue = new Queue(1);
  queue.defer(function (cb) {
    rimraf(path.resolve(process.cwd(), 'coverage'), function () {
      cb();
    });
  });
  queue.defer(link.bind(null));
  queue.defer(function (cb) {
    var args = ['--config', path.resolve(__dirname, 'c8rc.json')];
    args = args.concat(['mocha', '--config', path.resolve(__dirname, '..', '..', 'test', 'mocha', 'esm', 'mocharc.json')]);
    args = args.concat(_args.length ? _args.slice(-1) : ['test/unit/*.test.*']);
    spawn('c8', args, { env: { BABEL_ENV: 'test' } }, cb);
  });
  queue.await(cb);
};
