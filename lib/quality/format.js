/* eslint-disable @typescript-eslint/no-var-requires */
var spawn = require('../lib/spawn');

module.exports = function format(_args, _options, cb) {
  var args = ['--write', '.'];
  spawn('prettier', args, {}, cb);
};
