import spawn from 'cross-spawn-cb';
import which from 'module-which';
import Queue from 'queue-cb';
import docs from 'tsds-typedoc';

export default function version(args, options, callback) {
  const cwd = options.cwd || process.cwd();

  const queue = new Queue(1);
  queue.defer(docs.bind(null, args, options));
  queue.defer((_cb) => {
    which('gh-pages', options, (err, pages) => {
      err ? callback(err) : spawn(pages, ['-d', 'docs'], { cwd }, callback);
    });
  });
  queue.await(callback);
}
