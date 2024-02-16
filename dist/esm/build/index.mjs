const Queue = require('queue-cb');
const cjs = require('./cjs');
const esm = require('./esm');
const umd = require('./umd');
const types = require('./types');
const targets = require('../lib/targets');
module.exports = function build(args, options, cb) {
    const targs = targets(options);
    const queue = new Queue(1);
    targs.indexOf('cjs') < 0 || queue.defer(cjs.bind(null, args, options));
    targs.indexOf('esm') < 0 || queue.defer(esm.bind(null, args, options));
    targs.indexOf('umd') < 0 || queue.defer(umd.bind(null, args, options));
    queue.defer(types.bind(null, args, options));
    queue.await(cb);
};
