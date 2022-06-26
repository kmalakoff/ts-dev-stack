/* eslint-disable @typescript-eslint/no-var-requires */
var spawn = require('../lib/spawn');

module.exports = function post(_args, _options, cb) {
  spawn('gh-pages', ['-d', 'docs'], {}, cb);
};
