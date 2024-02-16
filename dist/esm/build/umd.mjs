const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const assign = require('just-extend');
const Queue = require('queue-cb');
const spawn = require('../lib/spawn');
const source = require('../lib/source');
module.exports = function umd(_args, options, cb) {
    const cwd = options.cwd || process.cwd();
    const src = path.resolve(cwd, source(options));
    options = assign({}, options);
    options.type = 'umd';
    options.sourceMaps = true;
    options.dest = path.join(cwd, 'dist', 'umd');
    rimraf(options.dest, ()=>{
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
