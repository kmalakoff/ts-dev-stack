import Queue from 'queue-cb';
import { spawn } from 'tsds-lib';
import docs from 'tsds-typedoc';
export default function version(_args, _options, cb) {
    const queue = new Queue(1);
    queue.defer(docs.bind(null, _args, _options));
    queue.defer(spawn.bind(null, 'git', [
        'add',
        'docs'
    ], {}));
    queue.await(cb);
}
