const fs = require('fs');
const path = require('path');
const Queue = require('queue-cb');
const rimraf2 = require('rimraf2');
const compileDirectory = require('./compileDirectory');
module.exports = function cjs(_args, options, cb) {
    const cwd = options.cwd || process.cwd();
    options = {
        ...options
    };
    options.type = 'cjs';
    options.sourceMaps = true;
    options.dest = path.join(cwd, 'dist', 'cjs');
    rimraf2(options.dest, {
        disableGlob: true
    }, ()=>{
        const queue = new Queue(1);
        queue.defer(compileDirectory.bind(null, options));
        queue.defer(fs.writeFile.bind(null, path.join(options.dest, 'package.json'), '{"type":"commonjs"}'));
        queue.await(cb);
    });
};
