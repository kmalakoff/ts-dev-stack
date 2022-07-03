var path = require('path');
var Queue = require('queue-cb');

var link = require('../../link');
var spawn = require('../../lib/spawn');

var major = +process.versions.node.split('.')[0];

var swcRegisterCompat = path.resolve(__dirname, '..', '..', 'lib', 'swc-register', 'index.js');

module.exports = function mocha(args, options, cb) {
  console.log('mocha')
  link(args, options, function (err, restore) {
    var queue = new Queue(1);
    queue.defer(function(cb) {
      var tests = args.length ? args[0] : 'test/**/*.test.*';
      if (major < 12) {
        spawn('mocha-compat', ['--require', swcRegisterCompat, '--watch-extensions', 'ts,tsx', tests], {}, cb);
      } else {
        spawn('mocha', ['--watch-extensions', 'ts,tsx,mjs', tests], { env: { NODE_OPTIONS: '--loader tsx' } }, cb);
      }  
    })
    queue.await(function(err) {
      restore(function (err2) {
        cb(err || err2);
      });
    })
  });
};

module.exports.options = { alias: { temp: 't' } };
