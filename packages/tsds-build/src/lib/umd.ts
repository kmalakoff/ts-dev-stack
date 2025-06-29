import spawn from 'cross-spawn-cb';
import { installSync } from 'install-optional';
import debounce from 'lodash.debounce';
import path from 'path';
import Queue from 'queue-cb';
import resolveBin from 'resolve-bin-sync';
import rimraf2 from 'rimraf2';
import { type CommandCallback, type CommandOptions, wrapWorker } from 'tsds-lib';
import url from 'url';

const major = +process.versions.node.split('.')[0];
const version = major > 14 ? 'local' : 'stable';
const __dirname = path.dirname(typeof __filename === 'undefined' ? url.fileURLToPath(import.meta.url) : __filename);
const dist = path.join(__dirname, '..', '..');
const workerWrapper = wrapWorker(path.join(dist, 'cjs', 'lib', 'umd.js'));

const installSyncRollup = debounce(installSync, 300, { leading: true, trailing: false });

function worker(_args: string[], options: CommandOptions, callback: CommandCallback): undefined {
  const cwd: string = (options.cwd as string) || process.cwd();
  const dest = path.join(cwd, 'dist', 'umd');
  const configRoot = path.join(dist, 'esm', 'rollup');

  try {
    installSyncRollup('rollup', `${process.platform}-${process.arch}`, { cwd });
    const rollup = resolveBin('rollup');

    const queue = new Queue(1);
    queue.defer((cb) => rimraf2(dest, { disableGlob: true }, cb.bind(null, null)));
    queue.defer(spawn.bind(null, rollup, ['--config', path.join(configRoot, 'config.js')], options));
    queue.defer(spawn.bind(null, rollup, ['--config', path.join(configRoot, 'config.min.js')], options));
    queue.await(callback);
  } catch (err) {
    return callback(err);
  }
}

export default function umd(args: string[], options: CommandOptions, callback: CommandCallback): undefined {
  version !== 'local' ? workerWrapper('stable', args, options, callback) : worker(args, options, callback);
}
