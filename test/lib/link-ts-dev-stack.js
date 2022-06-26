/* eslint-disable @typescript-eslint/no-var-requires */
var path = require('path');
var fs = require('fs');
var Queue = require('queue-cb');

var tsdsPath = path.resolve(__dirname, '..', '..');

function createLink(installPath, options, cb) {
  var queue = new Queue(1);
  queue.defer(function (cb) {
    fs.mkdir(path.resolve(options.cwd, 'node_modules'), function () {
      cb();
    });
  });
  queue.defer(fs.symlink.bind(null, tsdsPath, installPath, 'dir'));
  queue.await(cb);
}

module.exports = function link(options, cb) {
  try {
    var pkg = require(path.join(tsdsPath, 'package.json'));
    var installPath = path.resolve(options.cwd, 'node_modules', pkg.name);

    fs.lstat(installPath, function (_, lstat) {
      if (!lstat) return createLink(installPath, options, cb);
      if (lstat.isSymbolicLink()) return cb(); // exists
      if (lstat.isDirectory()) return cb(new Error('Cannot remove a directory for linking'));

      fs.unlink(installPath, function () {
        createLink(installPath, options, cb);
      });
    });
  } catch (err) {
    return cb(err);
  }
};
