const Queue = require('queue-cb');
const { spawn } = require('tsds-lib');

const build = require('../build');
const format = require('../quality/format');

module.exports = function predeploy(args, options, cb) {
  const cwd = options.cwd || process.cwd();

  const queue = new Queue(1);
  queue.defer(format.bind(null, args, options));
  queue.defer(build.bind(null, args, options));
  queue.defer(spawn.bind(null, 'sort-package-json', [], { cwd }));
  queue.defer(spawn.bind(null, 'depcheck', [], { cwd }));
  queue.await(cb);
};
