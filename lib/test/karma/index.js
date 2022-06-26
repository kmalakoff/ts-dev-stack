/* eslint-disable @typescript-eslint/no-var-requires */
var path = require('path');
var link = require('../../lib/link');
var spawn = require('../../lib/spawn');

module.exports = function karma(_args, _options, cb) {
  link(function (err) {
    if (err) return cb(err);

    var args = ['start', path.resolve(__dirname, 'karma.conf.cjs')];
    args = args.concat(_args.length ? _args.slice(-1) : ['test/**/*.test.*']);
    spawn('karma', args, {}, cb);
  });
};
