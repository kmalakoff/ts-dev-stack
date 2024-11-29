const path = require('path');
const _fs = require('fs');
const mkdirp = require('mkdirp');
const Queue = require('queue-cb');
const rimraf2 = require('rimraf2');
const spawn = require('../lib/spawn');
const source = require('../lib/source');
module.exports = function docs(_args, options, cb) {
    const cwd = options.cwd || process.cwd();
    const src = source(options);
    const dest = path.resolve(process.cwd(), 'docs');
    rimraf2(dest, {
        disableGlob: true
    }, ()=>{
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
