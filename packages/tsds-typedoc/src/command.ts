import spawn from 'cross-spawn-cb';
import { link, unlink } from 'link-unlink';
import mkdirp from 'mkdirp-classic';
import path from 'path';
import Queue from 'queue-cb';
import resolveBin from 'resolve-bin-sync';
import rimraf2 from 'rimraf2';
import { type CommandCallback, type CommandOptions, installPath, loadConfig, wrapWorker } from 'tsds-lib';
import url from 'url';

const major = +process.versions.node.split('.')[0];
const version = major > 14 ? 'local' : 'stable';
const __dirname = path.dirname(typeof __filename === 'undefined' ? url.fileURLToPath(import.meta.url) : __filename);
const dist = path.join(__dirname, '..');
const workerWrapper = wrapWorker(path.join(dist, 'cjs', 'command.js'));

function worker(args: string[], options: CommandOptions, callback: CommandCallback) {
  const config = loadConfig(options);
  if (!config) {
    console.log('tsds: no config. Skipping');
    return callback();
  }
  if (!config.source) {
    console.log('tsds: config missing source. Skipping docs');
    return callback();
  }

  try {
    const cwd: string = (options.cwd as string) || process.cwd();
    const typedoc = resolveBin('typedoc');
    const dest = path.join(cwd, 'docs');

    const queue = new Queue(1);
    queue.defer((cb) => rimraf2(dest, { disableGlob: true }, cb.bind(null, null)));
    queue.defer(mkdirp.bind(null, dest));
    queue.defer(link.bind(null, cwd, installPath(options))); // link the latest for tests
    queue.defer(spawn.bind(null, typedoc, [config.source, ...args, '--excludeExternals', 'true'], options));
    queue.await((err) => {
      // unlink the latest for tests
      unlink(installPath(options), () => {
        callback(err);
      });
    });
  } catch (err) {
    return callback(err);
  }
}

export default function docs(args: string[], options: CommandOptions, callback: CommandCallback) {
  version !== 'local' ? workerWrapper('stable', args, options, callback) : worker(args, options, callback);
}
