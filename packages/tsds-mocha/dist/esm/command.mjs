import Queue from 'queue-cb';
import { installPath, link, optionsToArgs, spawn } from 'tsds-lib';
const major = +process.versions.node.split('.')[0];
const mochaName = major < 12 ? 'mocha-compat' : 'mocha';
let binMocha = null;
export default function command(_args, options, cb) {
    if (!binMocha) binMocha = require.resolve(`${mochaName}/bin/_${mochaName}`);
    const cwd = options.cwd || process.cwd();
    link(installPath(options), (_err, restore)=>{
        const queue = new Queue(1);
        queue.defer((cb)=>{
            let args = [
                binMocha,
                '--watch-extensions',
                'ts,tsx'
            ];
            args = args.concat(optionsToArgs(options));
            args = args.concat(_args.length ? _args.slice(-1) : [
                'test/**/*.test.*'
            ]);
            spawn(require.resolve('ts-swc-loaders/bin/cli.js'), args, {
                cwd
            }, cb);
        });
        queue.await((err)=>{
            restore((err2)=>{
                cb(err || err2);
            });
        });
    });
}
module.exports.options = {
    alias: {
        temp: 't'
    }
};
