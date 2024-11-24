const path = require('node:path');
const rimraf = require('rimraf');
const Queue = require('queue-cb');

const link = require('../link');
const spawn = require('../lib/spawn');
const optionsToArgs = require('../lib/optionsToArgs');

const major = +process.versions.node.split('.')[0];
const mochaName = major < 12 ? 'mocha-compat' : 'mocha';

let binC8 = null;
let binMocha = null;
module.exports = function c8(_args, options, cb) {
  if (!binC8) binC8 = require.resolve('c8/bin/c8');
  if (!binMocha) binMocha = require.resolve(`${mochaName}/bin/_${mochaName}`);
  const cwd = options.cwd || process.cwd();

  link(_args, options, (err, restore) => {
    if (err) return cb(err);

    const queue = new Queue(1);
    queue.defer((cb) => {
      rimraf(path.resolve(process.cwd(), 'coverage'), () => {
        cb();
      });
    });
    queue.defer((cb) => {
      let args = [binC8, '--config', path.join(__dirname, '..', '..', '..', 'assets', 'c8rc.json')];
      args = args.concat([binMocha, '--watch-extensions', 'ts,tsx']);
      args = args.concat(optionsToArgs(options));
      args = args.concat(_args.length ? _args.slice(-1) : ['test/**/*.test.*']);
      spawn('ts-swc', args, { cwd }, cb);
    });
    queue.await((err) => {
      restore((err2) => {
        cb(err || err2);
      });
    });
  });
};
