var spawn = require('../lib/spawn');

module.exports = function format(_args, options, cb) {
  var cwd = options.cwd || process.cwd();
  var args = ['--write', '.'];
  spawn('prettier', args, { cwd: cwd }, cb);
};
