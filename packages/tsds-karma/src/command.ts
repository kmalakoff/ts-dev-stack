import path from 'path';
import url from 'url';
import spawn from 'cross-spawn-cb';
import { link, unlink } from 'link-unlink';
import moduleRoot from 'module-root-sync';
import Queue from 'queue-cb';
import resolveBin from 'resolve-bin-sync';
import { installPath } from 'tsds-lib';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));

const config = path.join(moduleRoot(__dirname), 'assets', 'karma.conf.cjs');

export default function karma(args, options, callback) {
  const cwd = options.cwd || process.cwd();

  link(cwd, installPath(options), (err, restore) => {
    if (err) return callback(err);

    try {
      const karma = resolveBin('karma');
      const tests = args.length ? args[0] : 'test/**/*.test.*';

      const queue = new Queue(1);
      queue.defer(spawn.bind(null, karma, ['start', config, tests], options));
      queue.await((err) => unlink(restore, callback.bind(err)));
    } catch (err) {
      callback(err);
    }
  });
}
