import path from 'path';
import Queue from 'queue-cb';
import rimraf2 from 'rimraf2';
import { type CommandCallback, type CommandOptions, type ConfigOptions, loadConfig } from 'tsds-lib';
import { DEFAULT_TARGETS } from './constants.js';
import files from './lib/files.js';
import umd from './lib/umd.js';
import type { BuildOptions } from './types.js';

export default function build(args: string[], options: CommandOptions | BuildOptions, callback: CommandCallback) {
  const commandOptions = options as CommandOptions;
  const buildOptions = options as BuildOptions;
  const config = loadConfig(options as ConfigOptions);
  if (!config) {
    console.log('tsds: no config. Skipping');
    return callback();
  }
  const cwd: string = (commandOptions.cwd as string) || process.cwd();
  const targets = config.targets || DEFAULT_TARGETS;
  const clean = buildOptions.clean === undefined ? true : buildOptions.clean;
  const dest = path.join(cwd, 'dist');
  const queue = new Queue(1);
  !clean || queue.defer((cb) => rimraf2(dest, { disableGlob: true }, cb.bind(null, null)));
  targets.indexOf('cjs') < 0 || queue.defer(files.bind(null, args, 'cjs', options));
  targets.indexOf('esm') < 0 || queue.defer(files.bind(null, args, 'esm', options));
  targets.indexOf('umd') < 0 || queue.defer(umd.bind(null, args, options));
  queue.await(callback);
}
