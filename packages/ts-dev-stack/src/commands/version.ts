import path from 'path';
import url from 'url';
import spawn from 'cross-spawn-cb';
import moduleRoot from 'module-root-sync';
import { prependEnvPath } from 'module-which';
import Queue from 'queue-cb';
import docs from 'tsds-typedoc';

export default function version(args, options, callback) {
  const queue = new Queue(1);
  queue.defer(docs.bind(null, args, options));
  queue.defer(spawn.bind(null, 'gh-pages', ['-d', 'docs'], options));
  queue.await(callback);
}
