import path from 'path';
import url from 'url';
import getopts from 'getopts-compat';
import { link, unlink } from 'link-unlink';
import { whichAll } from 'module-which';
import Queue from 'queue-cb';
import rimraf2 from 'rimraf2';
import { installPath, spawn } from 'tsds-lib';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));

const major = +process.versions.node.split('.')[0];
const config = path.join(__dirname, '..', '..', '..', 'assets', 'c8rc.json');

export default function c8(args, options, callback) {
  whichAll([major < 12 ? 'mocha-compat' : 'mocha', 'ts-swc'], options, (err, results) => {
    if (err) return callback(err);
    const [mocha, loader] = results;

    const cwd = options.cwd || process.cwd();
    const { _, ...opts } = getopts(args, { stopEarly: true, alias: { config: 'c' } });
    const spawnArgs = [c8];
    if (!opts.config) Array.prototype.push.apply(spawnArgs, ['--config', config]);
    Array.prototype.push(spawnArgs, [mocha, '--watch-extensions', 'ts,tsx']);
    Array.prototype.push(spawnArgs, args);
    if (_.length === 0) Array.prototype.push.apply(spawnArgs, [['test/**/*.test.*']]);
    const dest = path.resolve(cwd, 'coverage');

    link(cwd, installPath(options), (err, restore) => {
      if (err) return callback(err);

      const queue = new Queue(1);
      queue.defer((cb) => rimraf2(dest, { disableGlob: true }, cb.bind(null, null)));
      queue.defer(spawn.bind(null, loader, spawnArgs, { cwd }));
      queue.await((err) => {
        unlink(restore, (err2) => {
          callback(err || err2);
        });
      });
    });
  });
}
