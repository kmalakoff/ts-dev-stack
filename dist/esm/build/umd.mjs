const fs = require('fs');
const path = require('path');
const Queue = require('queue-cb');
const rimraf2 = require('rimraf2');
const spawn = require('../lib/spawn');
const source = require('../lib/source');
module.exports = function umd(_args, options, cb) {
    const cwd = options.cwd || process.cwd();
    const src = path.resolve(cwd, source(options));
    options = {
        ...options
    };
    options.type = 'umd';
    options.sourceMaps = true;
    options.dest = path.join(cwd, 'dist', 'umd');
    rimraf2(options.dest, {
        disableGlob: true
    }, ()=>{
        const queue = new Queue(1);
        queue.defer(spawn.bind(null, 'rollup', [
            '--config',
            path.resolve(__dirname, '..', '..', 'esm', 'rollup-swc', 'index.mjs'),
            '--input',
            src
        ], {
            cwd
        }));
        queue.defer(fs.writeFile.bind(null, path.join(options.dest, 'package.json'), '{"type":"commonjs"}'));
        queue.await(cb);
    });
};
