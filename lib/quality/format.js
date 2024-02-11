var spawn = require('../lib/spawn');

var args = 'check --apply src/ lib/ test/'.split(' ');

module.exports = function format(_args, options, cb) {
  var cwd = options.cwd || process.cwd();
  spawn('biome', args, { cwd: cwd }, cb);
};
