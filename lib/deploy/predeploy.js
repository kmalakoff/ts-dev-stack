var Queue = require('queue-cb');
var spawn = require('../lib/spawn');

var build = require('../build');
var format = require('../quality/format');
var lint = require('../quality/lint');

module.exports = function predeploy(args, options, cb) {
  var queue = new Queue(1);
  queue.defer(lint.bind(null, args, options));
  queue.defer(format.bind(null, args, options));
  queue.defer(build.bind(null, args, options));
  queue.defer(spawn.bind(null, 'git', ['add', 'build'], {}));
  queue.defer(spawn.bind(null, 'sortpack', [], {}));
  queue.defer(spawn.bind(null, 'depcheck', [], {}));
  queue.await(cb);
};
