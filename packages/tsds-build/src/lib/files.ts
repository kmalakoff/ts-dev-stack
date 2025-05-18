import fs from 'fs';
import path from 'path';
import Iterator from 'fs-iterator';
import mkdirp from 'mkdirp-classic';
import Queue from 'queue-cb';
import { transformDirectory, transformTypes } from 'ts-swc-transform';
import { loadConfig } from 'tsds-lib';

const MAX_FILES = 10;
const reportFn = (dest, type, cb) => (err, results) => {
  if (err) console.log(`${type} failed: ${err.message}`);
  else console.log(`Created ${results.length < MAX_FILES ? results.map((x) => `dist/${type}/${path.relative(dest, x)}`).join(',') : `${results.length} files in dist/${type}`}`);
  cb(err);
};

export default function files(_args, type, options, callback) {
  const config = loadConfig(options);
  if (!config) {
    console.log('tsds: no config. Skipping');
    return callback();
  }
  if (!config.source) {
    console.log(`tsds: config missing source. Skipping code: ${type}`);
    return callback();
  }

  const cwd = options.cwd || process.cwd();
  const src = path.dirname(path.join(cwd, config.source));
  const dest = path.join(cwd, 'dist', type);

  mkdirp(dest, (err) => {
    if (err) return callback(err);

    const queue = new Queue();
    queue.defer(fs.writeFile.bind(null, path.join(dest, 'package.json'), `{ "type": "${type === 'cjs' ? 'commonjs' : 'module'}" }`, 'utf8'));
    queue.defer((cb) => transformDirectory(src, dest, type, { ...options, type, sourceMaps: true }, reportFn(dest, type, cb)));
    queue.defer((cb) => transformTypes(src, dest, reportFn(dest, type, cb)));
    queue.await((err) => {
      if (err) return callback(err);
      if (type !== 'cjs') return callback();

      // move the types into the folder with the correct extension
      const iterator = new Iterator(dest);
      iterator.forEach(
        (entry, cb) => {
          if (!entry.stats.isFile()) return cb();
          const ext = path.extname(entry.basename);
          if (['.js', '.mjs'].indexOf(ext) < 0) return cb();
          const relative = path.relative(dest, path.dirname(entry.fullPath));
          const sourcePath = path.join(dest, relative, `${entry.basename.slice(0, -ext.length)}.d.ts`);
          const destPath = path.join(dest, relative, `${entry.basename.slice(0, -ext.length)}.d.${ext === '.js' ? 'cts' : 'mts'}`);
          return fs.copyFile(sourcePath, destPath, (err) => (err && err.code !== 'ENOENT' ? cb(err) : cb()));
        },
        { callbacks: true, concurrency: Infinity },
        callback
      );
    });
  });
}
