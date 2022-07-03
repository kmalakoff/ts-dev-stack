var path = require('path');

var link = require('../../lib/link');
var spawn = require('../../lib/spawn');

var major = +process.versions.node.split('.')[0];

var swcRegisterCompat = path.resolve(__dirname, '..', '..', 'lib', 'swc-register', 'index.js');

module.exports = function mocha(_args, _options, cb) {
  link(function (err) {
    if (err) return cb(err);
    var tests = _args.length ? _args.slice(-1) : ['test/**/*.test.*'];
    if (major < 12) {
      return spawn('mocha-compat', ['--require', swcRegisterCompat, '--watch-extensions', 'ts,tsx', tests], {}, cb);
    } else {
      return spawn('mocha', ['--watch-extensions', 'ts,tsx,mjs', tests], { env: { NODE_OPTIONS: '--loader tsx' } }, cb);
    }
  });
};

module.exports.options = { alias: { temp: 't' } };
