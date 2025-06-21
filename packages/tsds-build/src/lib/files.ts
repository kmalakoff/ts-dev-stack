import fs from 'fs';
import Iterator, { type Entry } from 'fs-iterator';
import mkdirp from 'mkdirp-classic';
import path from 'path';
import Queue, { type DeferCallback } from 'queue-cb';
import { type ConfigOptions, type TargetType, transformDirectory, transformTypes } from 'ts-swc-transform';
import { type CommandCallback, type CommandOptions, loadConfig } from 'tsds-lib';

const MAX_FILES = 10;

const reportFn = (dest: string, type: TargetType, cb: CommandCallback | DeferCallback) => (err?: Error, results?: string[]) => {
  if (err) console.log(`${type} failed: ${err.message}`);
  else console.log(`Created ${results.length < MAX_FILES ? results.map((x) => `dist/${type}/${path.relative(dest, x)}`).join(',') : `${results.length} files in dist/${type}`}`);
  cb(err);
};

export default function files(_args: string[], type: TargetType, options: CommandOptions, callback: CommandCallback): undefined {
  const config = loadConfig(options);
  if (!config) {
    console.log('tsds: no config. Skipping');
    return callback();
  }
  if (!config.source) {
    console.log(`tsds: config missing source. Skipping code: ${type}`);
    return callback();
  }

  const cwd: string = (options.cwd as string) || process.cwd();
  const src = path.dirname(path.join(cwd, config.source));
  const dest = path.join(cwd, 'dist', type);

  mkdirp(dest, (err) => {
    if (err) return callback(err);

    const queue = new Queue();
    queue.defer(fs.writeFile.bind(null, path.join(dest, 'package.json'), `{ "type": "${type === 'cjs' ? 'commonjs' : 'module'}" }`, 'utf8'));
    queue.defer((cb) => transformDirectory(src, dest, type, { ...options, sourceMaps: true } as ConfigOptions, reportFn(dest, type, cb)));
    queue.defer((cb) => transformTypes(src, dest, reportFn(dest, type, cb)));
    queue.await((err) => {
      if (err) return callback(err);
      if (type !== 'cjs') return callback();

      // move the types into the folder with the correct extension
      const iterator = new Iterator(dest);
      iterator.forEach(
        (entry: Entry, cb): undefined => {
          const ext = path.extname(entry.basename);
          if (!entry.stats.isFile() || ['.js', '.mjs'].indexOf(ext) < 0) {
            cb();
            return;
          }
          const relative = path.relative(dest, path.dirname(entry.fullPath));
          const sourcePath = path.join(dest, relative, `${entry.basename.slice(0, -ext.length)}.d.ts`);
          const destPath = path.join(dest, relative, `${entry.basename.slice(0, -ext.length)}.d.${ext === '.js' ? 'cts' : 'mts'}`);
          fs.copyFile(sourcePath, destPath, (err) => (err && err.code !== 'ENOENT' ? cb(err) : cb()));
        },
        { callbacks: true, concurrency: Infinity },
        callback
      );
    });
  });
}
