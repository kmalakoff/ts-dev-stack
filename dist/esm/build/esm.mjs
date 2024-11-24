const fs = require('node:fs');
const path = require('node:path');
const rimraf = require('rimraf');
const Queue = require('queue-cb');
const compileDirectory = require('./compileDirectory');
module.exports = function esm(_args, options, cb) {
    const cwd = options.cwd || process.cwd();
    options = {
        ...options
    };
    options.type = 'esm';
    options.sourceMaps = true;
    options.dest = path.join(cwd, 'dist', 'esm');
    rimraf(options.dest, ()=>{
        const queue = new Queue(1);
        queue.defer(compileDirectory.bind(null, options));
        queue.defer(fs.writeFile.bind(null, path.join(options.dest, 'package.json'), '{"type":"module"}'));
        queue.await(cb);
    });
};
