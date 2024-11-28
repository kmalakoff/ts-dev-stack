const fs = require('node:fs');
const path = require('node:path');
const Queue = require('queue-cb');
const rimraf = require('../lib/rimraf');
const compileDirectory = require('./compileDirectory');

module.exports = function cjs(_args, options, cb) {
  const cwd = options.cwd || process.cwd();
  options = { ...options };
  options.type = 'cjs';
  options.sourceMaps = true;
  options.dest = path.join(cwd, 'dist', 'cjs');
  rimraf(options.dest, () => {
    const queue = new Queue(1);
    queue.defer(compileDirectory.bind(null, options));
    queue.defer(fs.writeFile.bind(null, path.join(options.dest, 'package.json'), '{"type":"commonjs"}'));
    queue.await(cb);
  });
};
