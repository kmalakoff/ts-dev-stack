const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const Queue = require('queue-cb');
const spawn = require('../lib/spawn');
const source = require('../lib/source');
module.exports = function docs(_args, options, cb) {
    const cwd = options.cwd || process.cwd();
    const src = source(options);
    const dest = path.resolve(cwd, 'docs');
    const tsConfigDocsPath = path.join(cwd, 'tsconfig.docs.json');
    rimraf(dest, ()=>{
        const queue = new Queue(1);
        queue.defer(mkdirp.bind(null, dest));
        queue.defer((cb)=>{
            const tsConfig = require(path.join(cwd, 'tsconfig.json'));
            tsConfig.include = (tsConfig.include || []).filter((x)=>x.indexOf('test') !== 0);
            fs.writeFile(tsConfigDocsPath, JSON.stringify(tsConfig), 'utf8', cb);
        });
        queue.defer(spawn.bind(null, 'typedoc', [
            '--tsconfig',
            tsConfigDocsPath,
            '--includeVersion',
            src
        ], {
            cwd
        }));
        queue.defer(fs.unlink.bind(null, tsConfigDocsPath));
        queue.await(cb);
    });
};
