const spawn = require('../lib/spawn');

module.exports = function post(_args, options, cb) {
  const cwd = options.cwd || process.cwd();

  spawn('gh-pages', ['-d', 'docs'], { cwd: cwd }, cb);
};
