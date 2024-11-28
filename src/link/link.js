const path = require('node:path');
const fs = require('node:fs');
const Queue = require('queue-cb');
const mkdirp = require('mkdirp');
const unlink = require('../unlink/unlink');

function saveLink(installPath, cb) {
  const movedPath = path.join(path.dirname(installPath), `${path.basename(installPath)}.tsds`);
  const queue = new Queue(1);
  queue.defer(fs.rename.bind(null, installPath, movedPath));
  queue.defer(createLink.bind(null, installPath));
  queue.await(cb);
}

function createLink(installPath, cb) {
  const queue = new Queue(1);
  queue.defer((cb) => {
    mkdirp(path.dirname(installPath), () => {
      cb();
    });
  });
  queue.defer(fs.symlink.bind(null, process.cwd(), installPath, 'dir'));
  queue.await(cb);
}

function removeLink(installPath, cb) {
  fs.unlink(installPath, cb);
}

module.exports = function link(installPath, cb) {
  try {
    fs.lstat(installPath, (_, lstat) => {
      // new
      if (!lstat) {
        createLink(installPath, (err) => {
          err ? cb(err) : cb(null, removeLink.bind(null, installPath));
        });
      }

      // exists so move it
      else if (lstat.isDirectory()) {
        saveLink(installPath, (err) => {
          err ? cb(err) : cb(null, unlink.bind(null, installPath));
        });
      }

      // replace
      else {
        removeLink(installPath, () => {
          createLink(installPath, (err) => {
            err ? cb(err) : cb(null, removeLink.bind(null, installPath));
          });
        });
      }
    });
  } catch (err) {
    return cb(err);
  }
};
