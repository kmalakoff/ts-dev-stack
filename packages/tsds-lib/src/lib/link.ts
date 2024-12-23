import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp-classic';
import Queue from 'queue-cb';
import unlink from './unlink.js';

const isWindows = process.platform === 'win32' || /^(msys|cygwin)$/.test(process.env.OSTYPE);
const symlinkType = isWindows ? 'junction' : 'dir';

function saveLink(target, cb) {
  const movedPath = path.join(path.dirname(target), `${path.basename(target)}.tsds`);
  const queue = new Queue(1);
  queue.defer(fs.rename.bind(null, target, movedPath));
  queue.defer(createLink.bind(null, target));
  queue.await(cb);
}

function createLink(target, cb) {
  const queue = new Queue(1);
  queue.defer((cb) => {
    mkdirp(path.dirname(target), () => {
      cb();
    });
  });
  queue.defer(fs.symlink.bind(null, process.cwd(), target, symlinkType));
  queue.await(cb);
}

export default function link(target, cb) {
  try {
    fs.lstat(target, (_, lstat) => {
      // new
      if (!lstat) {
        createLink(target, (err) => {
          err ? cb(err) : cb(null, fs.unlink.bind(null, target));
        });
      }

      // exists so move it
      else if (lstat.isDirectory()) {
        saveLink(target, (err) => {
          err ? cb(err) : cb(null, unlink.bind(null, target));
        });
      }

      // replace
      else {
        fs.unlink(target, () => {
          createLink(target, (err) => {
            err ? cb(err) : cb(null, fs.unlink.bind(null, target));
          });
        });
      }
    });
  } catch (err) {
    return cb(err);
  }
}
