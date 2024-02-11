var Queue = require('queue-cb');

var link = require('../link');
var spawn = require('../lib/spawn');

var major = +process.versions.node.split('.')[0];

module.exports = function mocha(args, options, cb) {
  link(args, options, function (_err, restore) {
    var queue = new Queue(1);
    queue.defer(function (cb) {
      var tests = args.length ? args[0] : 'test/**/*.test.*';
      const mochaOptions = options.timeout ? ['--timeout', options.timeout] : [];
      if (major < 12) {
        spawn('mocha-compat', mochaOptions.concat(['--require', 'ts-swc-loaders', '--watch-extensions', 'ts,tsx', tests]), {}, cb);
      } else {
        spawn('mocha', mochaOptions.concat(['--watch-extensions', 'ts,tsx,mjs', tests]), { env: { NODE_OPTIONS: '--loader ts-swc-loaders' } }, cb);
      }
    });
    queue.await(function (err) {
      restore(function (err2) {
        cb(err || err2);
      });
    });
  });
};

module.exports.options = { alias: { temp: 't' } };
