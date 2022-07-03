var path = require('path');
var link = require('../../link');
var spawn = require('../../lib/spawn');

module.exports = function karma(_args, _options, cb) {
  link(_args, _options, function (err, restore) {
    if (err) return cb(err);
    var _cb = cb;
    cb = function (err) {
      restore(function (err2) {
        _cb(err || err2);
      });
    };

    var args = ['start', path.resolve(__dirname, 'karma.conf.cjs')];
    args = args.concat(_args.length ? _args.slice(-1) : ['test/**/*.test.*']);
    spawn('karma', args, {}, cb);
  });
};
