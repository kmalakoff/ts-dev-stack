var Queue = require('queue-cb');
var spawn = require('../lib/spawn');

var build = require('../build');
var format = require('../quality/format');
var lint = require('../quality/lint');

module.exports = function predeploy(args, options, cb) {
  var cwd = options.cwd || process.cwd();

  var queue = new Queue(1);
  queue.defer(lint.bind(null, args, options));
  queue.defer(format.bind(null, args, options));
  queue.defer(build.bind(null, args, options));
  queue.defer(spawn.bind(null, 'git', ['add', 'build'], { cwd: cwd }));
  queue.defer(spawn.bind(null, 'git', ['add', 'build'], { cwd: cwd }));
  queue.defer(spawn.bind(null, 'sortpack', [], { cwd: cwd }));
  queue.defer(spawn.bind(null, 'depcheck', [], { cwd: cwd }));
  queue.await(cb);
};
