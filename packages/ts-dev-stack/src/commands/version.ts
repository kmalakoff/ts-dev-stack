import spawn from 'cross-spawn-cb';
import Queue from 'queue-cb';
import resolveBin from 'resolve-bin-sync';
import docs from 'tsds-typedoc';

export default function version(args, options, callback) {
  try {
    const ghPages = resolveBin('gh-pages');

    const queue = new Queue(1);
    queue.defer(docs.bind(null, args, options));
    queue.defer(spawn.bind(null, ghPages, ['-d', 'docs'], options));
    queue.await(callback);
  } catch (err) {
    return callback(err);
  }
}
