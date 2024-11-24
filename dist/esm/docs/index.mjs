const path = require('node:path');
const _fs = require('node:fs');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const Queue = require('queue-cb');
const spawn = require('../lib/spawn');
const source = require('../lib/source');
module.exports = function docs(_args, options, cb) {
    const cwd = options.cwd || process.cwd();
    const src = source(options);
    const dest = path.resolve(process.cwd(), 'docs');
    rimraf(dest, ()=>{
        const queue = new Queue(1);
        queue.defer(mkdirp.bind(null, dest));
        queue.defer(spawn.bind(null, 'typedoc', [
            src
        ], {
            cwd
        }));
        queue.await(cb);
    });
};
