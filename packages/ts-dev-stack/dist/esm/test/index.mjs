import Queue from 'queue-cb';
import mocha from 'tsds-mocha';
import karma from './karma.mjs';
// import c8 from './c8.mjs';
export default function test(args, options, cb) {
    const queue = new Queue(1);
    queue.defer(mocha.bind(null, args, options));
    queue.defer(karma.bind(null, args, options));
    // queue.defer(c8.bind(null, args, options));
    queue.await(cb);
}
