import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp-classic';
import tempSuffix from 'temp-suffix';

const isWindows = process.platform === 'win32' || /^(msys|cygwin)$/.test(process.env.OSTYPE);
const dirSymlinkType = isWindows ? 'junction' : 'dir';

function saveLink(target, callback) {
  const movedPath = path.join(path.dirname(target), `${path.basename(target)}.${tempSuffix()}`);
  fs.rename(target, movedPath, callback);
}

function createLink(src, target, callback) {
  fs.stat(src, (err, stat) => {
    if (err) return callback(err);

    mkdirp(path.dirname(target), () => {
      fs.symlink(src, target, stat.isFile() ? 'file' : dirSymlinkType, (err) => (err ? callback(err) : callback(null, target)));
    });
  });
}

export default function link(src, target, callback) {
  fs.lstat(target, (_, stat) => {
    // new
    if (!stat) createLink(src, target, callback);
    // exists so move it
    else if (stat.isDirectory()) {
      saveLink(target, (err) => {
        err ? callback(err) : createLink(src, target, callback);
      });
    }

    // replace
    else {
      fs.unlink(target, () => {
        createLink(src, target, callback);
      });
    }
  });
}
