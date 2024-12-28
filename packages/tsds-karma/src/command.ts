import path from 'path';
import url from 'url';
import { link, unlink } from 'link-unlink';
import moduleRoot from 'module-root-sync';
import which from 'module-which';
import Queue from 'queue-cb';
import { installPath, spawn } from 'tsds-lib';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));

const config = path.join(moduleRoot(__dirname), 'assets', 'karma.conf.cjs');

export default function karma(args, options, callback) {
  const cwd = options.cwd || process.cwd();

  which('karma', options, (err, karma) => {
    if (err) return callback(err);
    link(cwd, installPath(options), (err, restore) => {
      if (err) return callback(err);

      const queue = new Queue(1);
      queue.defer((callback) => {
        const tests = args.length ? args[0] : 'test/**/*.test.*';
        spawn(karma, ['start', config, tests], {}, callback);
      });
      queue.await((err) => {
        unlink(restore, (err2) => {
          callback(err || err2);
        });
      });
    });
  });
}
