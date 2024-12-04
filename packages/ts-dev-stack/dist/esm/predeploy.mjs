import Queue from 'queue-cb';
import { spawn } from 'tsds-lib';
import format from 'tsds-biome';
import build from 'tsds-build';
export default function predeploy(args, options, cb) {
    const cwd = options.cwd || process.cwd();
    const queue = new Queue(1);
    queue.defer(format.bind(null, args, options));
    queue.defer(build.bind(null, args, options));
    queue.defer(spawn.bind(null, 'sort-package-json', [], {
        cwd
    }));
    queue.defer(spawn.bind(null, 'depcheck', [], {
        cwd
    }));
    queue.await(cb);
}
