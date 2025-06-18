import spawn from 'cross-spawn-cb';
import getopts from 'getopts-compat';
import { installSync, removeSync } from 'install-optional';
import { link, unlink } from 'link-unlink';
import path from 'path';
import Queue from 'queue-cb';
import resolveBin from 'resolve-bin-sync';
import type { CommandCallback, CommandOptions } from 'tsds-lib';
import { installPath, wrapWorker } from 'tsds-lib';
import url from 'url';

const major = +process.versions.node.split('.')[0];
const version = major > 14 ? 'local' : 'stable';
const __dirname = path.dirname(typeof __filename === 'undefined' ? url.fileURLToPath(import.meta.url) : __filename);
const dist = path.join(__dirname, '..');
const workerWrapper = wrapWorker(path.join(dist, 'cjs', 'command.js'));
const config = path.join(dist, 'esm', 'wtr.config.js');

function worker(args: string[], options: CommandOptions, callback: CommandCallback) {
  const cwd: string = (options.cwd as string) || process.cwd();

  link(cwd, installPath(options), (err, restore) => {
    if (err) return callback(err);

    try {
      installSync('rollup', `${process.platform}-${process.arch}`, { cwd });
      removeSync('esbuild', '@esbuild/', { cwd });
      installSync('esbuild', `${process.platform}-${process.arch}`, { cwd });

      const wtr = resolveBin('@web/test-runner', 'wtr');
      const { _, ...opts } = getopts(args, { stopEarly: true, alias: { config: 'c' } });
      const spawnArgs = [];
      if (!opts.config) Array.prototype.push.apply(spawnArgs, ['--config', config]);
      Array.prototype.push.apply(spawnArgs, args);
      if (_.length === 0) Array.prototype.push.apply(spawnArgs, ['test/**/*.test.{ts,tsx,jsx,mjs}']);

      const queue = new Queue(1);
      queue.defer(spawn.bind(null, wtr, spawnArgs, options));
      queue.await((err) => unlink(restore, callback.bind(null, err)));
    } catch (err) {
      callback(err);
    }
  });
}

export default function testBrowser(args, options, cb) {
  version !== 'local' ? workerWrapper('stable', args, options, cb) : worker(args, options, cb);
}
