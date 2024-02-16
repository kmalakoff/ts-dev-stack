const path = require('path');
const rimraf = require('rimraf');
const Queue = require('queue-cb');
// const { spawnArgs } = require('ts-swc-loaders');

const link = require('../link');
const spawn = require('../lib/spawn');

// const major = +process.versions.node.split('.')[0];
// const type = major >= 12 ? 'module' : 'commonjs';

module.exports = function c8(_args, options, cb) {
  link(_args, options, (err, restore) => {
    if (err) return cb(err);

    const queue = new Queue(1);
    queue.defer((cb) => {
      rimraf(path.resolve(process.cwd(), 'coverage'), () => {
        cb();
      });
    });
    queue.defer((cb) => {
      // TODO: get spawn working for c8
      const cmd = path.resolve('./node_modules/c8/bin/c8.js');
      let args = ['--no-warnings=ExperimentalWarning', cmd, '--config', path.join(__dirname, '..', '..', '..', 'assets', 'c8rc.json'), 'mocha', '--watch-extensions', 'ts,tsx'];
      args = args.concat(_args.length ? _args.slice(-1) : ['test/**/*.test.*']);
      spawn('node', args, { env: { NODE_OPTIONS: '--no-warnings=ExperimentalWarning --loader ts-swc-loaders' } }, cb);
      // const argsSpawn = spawnArgs(type, cmd, args, {});
      // spawn(argsSpawn[0], argsSpawn[1], argsSpawn[2], cb);
    });
    queue.await((err) => {
      restore((err2) => {
        cb(err || err2);
      });
    });
  });
};
