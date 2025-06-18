import spawn from 'cross-spawn-cb';
import getopts from 'getopts-compat';
import { link, unlink } from 'link-unlink';
import path from 'path';
import Queue from 'queue-cb';
import resolveBin from 'resolve-bin-sync';
import rimraf2 from 'rimraf2';
import type { CommandCallback, CommandOptions } from 'tsds-lib';
import { installPath } from 'tsds-lib';
import url from 'url';

const __dirname = path.dirname(typeof __filename === 'undefined' ? url.fileURLToPath(import.meta.url) : __filename);

const major = +process.versions.node.split('.')[0];
const config = path.join(__dirname, '..', '..', '..', 'assets', 'c8rc.json');
const mochaBin = major < 12 ? ['mocha-compat'] : major < 14 ? ['mocha-compat-esm', 'mocha'] : ['mocha'];

export default function c8(args: string[], options: CommandOptions, callback: CommandCallback) {
  const cwd: string = (options.cwd as string) || process.cwd();

  link(cwd, installPath(options), (err, restore) => {
    if (err) return callback(err);

    try {
      const c8 = resolveBin('c8');
      const mocha = resolveBin.apply(null, mochaBin);
      const loader = resolveBin('ts-swc-loaders', 'ts-swc');

      const { _, ...opts } = getopts(args, { stopEarly: true, alias: { config: 'c' } });
      const spawnArgs = [c8];
      if (!opts.config) Array.prototype.push.apply(spawnArgs, ['--config', config]);
      Array.prototype.push.apply(spawnArgs, [mocha, '--watch-extensions', 'ts,tsx']);
      Array.prototype.push.apply(spawnArgs, args);
      if (_.length === 0) Array.prototype.push.apply(spawnArgs, [['test/**/*.test.*']]);
      const dest = path.join(cwd, 'coverage');

      const queue = new Queue(1);
      queue.defer((cb) => rimraf2(dest, { disableGlob: true }, cb.bind(null, null)));
      queue.defer(spawn.bind(null, loader, spawnArgs, options));
      queue.await((err) => unlink(restore, callback.bind(null, err)));
    } catch (err) {
      console.log(err.message);
      return callback(err);
    }
  });
}
