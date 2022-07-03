var path = require('path');
var rimraf = require('rimraf');
var Queue = require('queue-cb');

var link = require('../../link');
var spawn = require('../../lib/spawn');

module.exports = function c8(_args, _options, cb) {
  link(_args, _options, function (err, restore) {
    if (err) return cb(err);

    var queue = new Queue(1);
    queue.defer(function (cb) {
      rimraf(path.resolve(process.cwd(), 'coverage'), function () {
        cb();
      });
    });
    queue.defer(function (cb) {
      var args = ['--config', path.resolve(__dirname, 'c8rc.json')];
      args.push('mocha');
      args = args.concat(_args.length ? _args.slice(-1) : ['test/unit/*.test.*']);
      spawn('c8', args, { env: { NODE_OPTIONS: '--loader tsx' } }, cb);
    });
    queue.await(function (err) {
      restore(function (err2) {
        cb(err || err2);
      });
    });
  });
};
