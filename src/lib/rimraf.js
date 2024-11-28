import fs from 'fs';
import Iterator from 'fs-iterator';

export default function rimraf(dir, callback) {
  const iterator = new Iterator(dir);
  iterator.forEach(
    (entry, callback) => {
      if (entry.stats.isDirectory()) return fs.rmdir(entry.fullPath, callback);
      fs.unlink(entry.fullPath, callback);
    },
    { callbacks: true },
    callback
  );
}
