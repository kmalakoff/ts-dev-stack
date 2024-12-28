import Queue from 'queue-cb';
import { spawn } from 'tsds-lib';

import postpublish from './postpublish.js';
import prepublish from './prepublish.js';

export default function publish(args, options, callback) {
  const queue = new Queue(1);
  queue.defer(prepublish.bind(null, args, options));
  queue.defer(spawn.bind(null, 'np', ['--no-yarn'], {}));
  queue.defer(postpublish.bind(null, args, options));
  queue.await(callback);
}

export const options = { alias: { 'no-publish': 'np', preview: 'p', yarn: 'y' } };
