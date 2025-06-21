import path from 'path';
import Queue from 'queue-cb';
import rimraf2 from 'rimraf2';
import { type CommandCallback, loadConfig } from 'tsds-lib';
import { DEFAULT_TARGETS } from './constants.ts';
import files from './lib/files.ts';
import umd from './lib/umd.ts';
import type { BuildOptions } from './types.ts';

export default function build(args: string[], options: BuildOptions, callback: CommandCallback): undefined {
  const config = loadConfig(options);
  if (!config) {
    console.log('tsds: no config. Skipping');
    return callback();
  }
  const cwd: string = (options.cwd as string) || process.cwd();
  const targets = config.targets || DEFAULT_TARGETS;
  const clean = options.clean === undefined ? true : options.clean;
  const dest = path.join(cwd, 'dist');
  const queue = new Queue(1);
  !clean || queue.defer((cb) => rimraf2(dest, { disableGlob: true }, cb.bind(null, null)));
  targets.indexOf('cjs') < 0 || queue.defer(files.bind(null, args, 'cjs', options));
  targets.indexOf('esm') < 0 || queue.defer(files.bind(null, args, 'esm', options));
  targets.indexOf('umd') < 0 || queue.defer(umd.bind(null, args, options));
  queue.await(callback);
}
