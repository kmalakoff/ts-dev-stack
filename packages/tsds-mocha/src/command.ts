import spawn from 'cross-spawn-cb';
import getopts from 'getopts-compat';
import { link, unlink } from 'link-unlink';
import Queue from 'queue-cb';
import resolveBin from 'resolve-bin-sync';
import type { CommandCallback, CommandOptions } from 'tsds-lib';
import { installPath } from 'tsds-lib';

const major = +process.versions.node.split('.')[0];
const mochaBin = major < 12 ? 'mocha-compat' : major < 14 ? 'mocha-compat-esm' : 'mocha';

export default function command(args: string[], options: CommandOptions, callback: CommandCallback) {
  const cwd: string = (options.cwd as string) || process.cwd();

  link(cwd, installPath(options), (err, restore) => {
    if (err) return callback(err);

    try {
      const loader = resolveBin('ts-swc-loaders', 'ts-swc');
      const mocha = resolveBin(mochaBin);

      const { _ } = getopts(args, { stopEarly: true, alias: {} });
      const spawnArgs = major === 12 ? ['node'] : []; // TODO: troubleshoot node 12 and mocha
      Array.prototype.push.apply(spawnArgs, [mocha, '--watch-extensions', 'ts,tsx']);
      Array.prototype.push.apply(spawnArgs, args);
      if (_.length === 0) Array.prototype.push.apply(spawnArgs, ['test/**/*.test.*']);

      const queue = new Queue(1);
      queue.defer(spawn.bind(null, loader, spawnArgs, options));
      queue.await((err) => unlink(restore, callback.bind(null, err)));
    } catch (err) {
      console.log(err);
      callback(err);
    }
  });
}
