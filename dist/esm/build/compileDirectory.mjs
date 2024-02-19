const path = require('path');
const Iterator = require('fs-iterator');
const getTS = require('get-tsconfig-compat');
const { createMatcher } = require('ts-swc-loaders');
const source = require('../lib/source');
const compileFile = require('./compileFile');
module.exports = function compileDirectory(options, cb) {
    const cwd = options.cwd || process.cwd();
    const src = source(options);
    const srcFolder = path.dirname(path.resolve(cwd, src));
    const config = getTS.getTsconfig(path.resolve(cwd, 'tsconfig.json'));
    const matcher = createMatcher(config);
    options = {
        ...options,
        config
    };
    const iterator = new Iterator(srcFolder);
    iterator.forEach((entry, callback)=>{
        if (!entry.stats.isFile()) return callback();
        if (!matcher(entry.fullPath)) return callback();
        compileFile(entry, options, callback);
    }, {
        callbacks: true,
        concurrency: 1024
    }, cb);
};
