var spawn = require('../lib/spawn');

module.exports = function format(_args, options, cb) {
  var cwd = options.cwd || process.cwd();
  spawn('npm', ['run', 'format'], { cwd: cwd }, cb);
};
