var path = require('path');

var link = require('../../link');
var spawn = require('../../lib/spawn');

var major = +process.versions.node.split('.')[0];

var swcRegisterCompat = path.resolve(__dirname, '..', '..', 'lib', 'swc-register', 'index.js');

module.exports = function mocha(_args, _options, cb) {
  link(_args, _options, function (err, restore) {
    if (err) return cb(err);
    var _cb = cb;
    cb = function (err) {
      restore(function (err2) {
        _cb(err || err2);
      });
    };

    var tests = _args.length ? _args.slice(-1) : ['test/**/*.test.*'];
    if (major < 12) {
      return spawn('mocha-compat', ['--require', swcRegisterCompat, '--watch-extensions', 'ts,tsx', tests], {}, cb);
    } else {
      return spawn('mocha', ['--watch-extensions', 'ts,tsx,mjs', tests], { env: { NODE_OPTIONS: '--loader tsx' } }, cb);
    }
  });
};

module.exports.options = { alias: { temp: 't' } };
