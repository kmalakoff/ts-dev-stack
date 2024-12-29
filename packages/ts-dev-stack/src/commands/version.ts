import spawn from 'cross-spawn-cb';
import Queue from 'queue-cb';
import resolve from 'resolve';
import docs from 'tsds-typedoc';

export default function version(args, options, callback) {
  try {
    const cwd = options.cwd || process.cwd();
    const pages = resolve.sync('gh-pages/bin/gh-pages');

    const queue = new Queue(1);
    queue.defer(docs.bind(null, args, options));
    queue.defer(spawn.bind(null, pages, ['-d', 'docs'], { cwd }));
    queue.await(callback);
  } catch (err) {
    return callback(err);
  }
}
