var spawn = require('../lib/spawn');
var extensions = require('../lib/extensions');

module.exports = function lint(_args, _options, cb) {
  var args = ['.', '--ext', extensions.join(',')];
  spawn('eslint', args, {}, cb);
};
