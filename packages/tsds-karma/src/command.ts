import path from 'path';
import url from 'url';
import Queue from 'queue-cb';
import { installPath, link, packageRoot, spawn } from 'tsds-lib';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));

const config = path.join(packageRoot(__dirname), 'assets', 'karma.conf.cjs');

export default function karma(args, options, cb) {
  link(installPath(options), (_err, restore) => {
    const queue = new Queue(1);
    queue.defer((cb) => {
      const tests = args.length ? args[0] : 'test/**/*.test.*';
      spawn('karma', ['start', config, tests], {}, cb);
    });
    queue.await((err) => {
      restore((err2) => {
        cb(err || err2);
      });
    });
  });
}
