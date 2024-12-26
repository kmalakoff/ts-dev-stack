import path from 'path';
import url from 'url';
import Queue from 'queue-cb';
import { installPath, link, packageRoot, spawn, unlink } from 'tsds-lib';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));

const config = path.join(packageRoot(__dirname), 'assets', 'karma.conf.cjs');

export default function karma(args, options, cb) {
  const cwd = options.cwd || process.cwd();

  link(cwd, installPath(options), (err, restore) => {
    if (err) return cb(err);

    const queue = new Queue(1);
    queue.defer((cb) => {
      const tests = args.length ? args[0] : 'test/**/*.test.*';
      spawn('karma', ['start', config, tests], {}, cb);
    });
    queue.await((err) => {
      unlink(restore, (err2) => {
        cb(err || err2);
      });
    });
  });
}
