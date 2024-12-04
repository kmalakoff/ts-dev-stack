import path from 'path';
import Queue from 'queue-cb';
import { installPath, link, spawn } from 'tsds-lib';

function packageRoot(dir, packageName) {
  if (path.basename(dir) === packageName) return dir;
  const nextDir = path.dirname(dir);
  if (nextDir === dir) throw new Error(''.concat(packageName, ' not found'));
  return packageRoot(nextDir, packageName);
}
const config = path.join(packageRoot(__dirname, 'tsds-karma'), 'assets', 'karma.conf.js');

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
