import fs from 'fs';
import path from 'path';
import Queue from 'queue-cb';
import rimraf2 from 'rimraf2';

function restoreLink(previous, target, callback) {
  rimraf2(target, { disableGlob: true }, (err) => {
    err ? callback(err) : fs.rename(previous, target, callback);
  });
}

export default function unlink(target, callback) {
  const dirname = path.dirname(target);
  const basename = path.basename(target);

  fs.readdir(dirname, (err, files) => {
    if (err) return callback(err);
    const matches = files.filter((x) => x.indexOf(basename) === 0 && x.slice(basename.length)[0] === '.').map((x) => path.join(dirname, x));
    if (matches.length === 0) return callback();
    // if (matches.length === 1) return restoreLink(matches[0], target, callback);

    const stats = [];
    const queue = new Queue();
    matches.forEach((match) =>
      queue.defer((cb) => {
        fs.lstat(match, (err, stat) => {
          if (err) return callback(err);
          stats.push({ match, stat });
          cb();
        });
      })
    );
    queue.await((err) => {
      if (err) return callback(err);
      const sorted = stats.sort((a, b) => b.stat.ctime.valueOf() - a.stat.ctime.valueOf());
      restoreLink(sorted[0].match, target, callback);
    });
  });
}
