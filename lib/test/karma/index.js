var path = require('path');
var Queue = require('queue-cb');
var link = require('../../link');
var spawn = require('../../lib/spawn');

module.exports = function karma(args, options, cb) {
  link(args, options, function (err, restore) {
    var queue = new Queue(1);
    queue.defer(function (cb) {
      var tests = args.length ? args[0] : 'test/**/*.test.*';
      spawn('karma', ['start', path.resolve(__dirname, 'karma.conf.cjs'), tests], {}, cb);
    });
    queue.await(function (err) {
      restore(function (err2) {
        cb(err || err2);
      });
    });
  });
};
