import spawn from 'cross-spawn-cb';
import { link, unlink } from 'link-unlink';
import path from 'path';
import Queue from 'queue-cb';
import resolveBin from 'resolve-bin-sync';
import { type CommandCallback, type CommandOptions, installPath } from 'tsds-lib';
import url from 'url';

const __dirname = path.dirname(typeof __filename === 'undefined' ? url.fileURLToPath(import.meta.url) : __filename);
const config = path.join(__dirname, '..', '..', 'assets', 'karma.conf.js');

export default function karma(args: string[], options: CommandOptions, callback: CommandCallback) {
  const cwd: string = (options.cwd as string) || process.cwd();

  link(cwd, installPath(options), (err, restore) => {
    if (err) return callback(err);

    try {
      const karma = resolveBin('karma');
      const tests = args.length ? args[0] : 'test/**/*.test.*';

      const queue = new Queue(1);
      queue.defer(spawn.bind(null, karma, ['start', config, tests], options));
      queue.await((err) => unlink(restore, callback.bind(null, err)));
    } catch (err) {
      callback(err);
    }
  });
}
