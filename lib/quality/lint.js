var spawn = require('../lib/spawn');
var extensions = require('../lib/extensions');

module.exports = function lint(_args, options, cb) {
  var cwd = options.cwd || process.cwd();
  var args = ['.', '--ext', extensions.join(',')];
  spawn('eslint', args, { cwd: cwd }, cb);
};
