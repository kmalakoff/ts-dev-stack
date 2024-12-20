import Queue from 'queue-cb';
import { spawn } from 'tsds-lib';

import prepublish from './prepublish.js';

// @ts-ignore
import process from './lib/process.cjs';

function postpublish(_args, options, cb) {
  const cwd = options.cwd || process.cwd();

  spawn('gh-pages', ['-d', 'docs'], { cwd }, cb);
}

export default function publish(args, options, cb) {
  const npArgs = [];
  if (options['no-publish']) npArgs.push('--no-publish');
  if (options.preview) npArgs.push('--preview');
  if (!options.yarn) npArgs.push('--no-yarn');

  const queue = new Queue(1);
  queue.defer(prepublish.bind(null, args, options));
  queue.defer(spawn.bind(null, 'np', npArgs, {}));
  queue.defer(postpublish.bind(null, args, options));
  queue.await(cb);
}

export const options = { alias: { 'no-publish': 'np', preview: 'p', yarn: 'y' } };
