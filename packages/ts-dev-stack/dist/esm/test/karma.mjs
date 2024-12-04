import path from 'path';
import Queue from 'queue-cb';
import { installPath, link, spawn } from 'tsds-lib';
export default function karma(args, options, cb) {
    link(installPath(options), (_err, restore)=>{
        const queue = new Queue(1);
        queue.defer((cb)=>{
            const tests = args.length ? args[0] : 'test/**/*.test.*';
            spawn('karma', [
                'start',
                path.join(__dirname, '..', '..', '..', 'assets', 'karma.conf.js'),
                tests
            ], {}, cb);
        });
        queue.await((err)=>{
            restore((err2)=>{
                cb(err || err2);
            });
        });
    });
}
