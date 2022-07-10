var path = require('path');
var fs = require('fs');
var Queue = require('queue-cb');

function removeLink(installPath, cb) {
  fs.unlink(installPath, cb);
}

module.exports = function unlink(installPath, cb) {
  var movedPath = path.join(path.dirname(installPath), path.basename(installPath) + '.tsds');
  var queue = new Queue(1);
  queue.defer(removeLink.bind(null, installPath));
  queue.defer(fs.rename.bind(null, movedPath, installPath));
  queue.await(function () {
    cb();
  });
};
