var path = require('path');
var fs = require('fs');
var Queue = require('queue-cb');
var mkdirp = require('mkdirp');

function createLink(installPath, cb) {
  var queue = new Queue(1);
  queue.defer(function (cb) {
    mkdirp(path.dirname(installPath), function () {
      cb();
    });
  });
  queue.defer(fs.symlink.bind(null, process.cwd(), installPath, 'dir'));
  queue.await(cb);
}

module.exports = function link(cb) {
  try {
    var pkg = require(path.resolve(process.cwd(), 'package.json'));
    var installPath = path.resolve(process.cwd(), 'node_modules', pkg.name);

    fs.lstat(installPath, function (_, lstat) {
      if (!lstat) return createLink(installPath, cb);
      if (lstat.isSymbolicLink()) return cb(); // exists
      if (lstat.isDirectory()) return cb(new Error('Cannot remove a directory for linking'));

      fs.unlink(installPath, function () {
        createLink(installPath, cb);
      });
    });
  } catch (err) {
    return cb(err);
  }
};
