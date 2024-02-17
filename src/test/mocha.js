const Queue = require('queue-cb');
const { spawnArgs } = require('ts-swc-loaders');

const link = require('../link');
const spawn = require('../lib/spawn');

const major = +process.versions.node.split('.')[0];
const type = major >= 12 ? 'module' : 'commonjs';

module.exports = function mocha(_args, options, cb) {
  link(_args, options, (_err, restore) => {
    const queue = new Queue(1);
    queue.defer((cb) => {
      const mocha = major >= 12 ? 'mocha' : 'mocha-compat';
      const cmd = require.resolve(`${mocha}/bin/_${mocha}`);
      let args = ['--watch-extensions', 'ts,tsx'];
      for (const key in options) {
        if (key === '_') continue;
        if (options[key] === true) args.push(`--${key}`);
        else if (options[key] === false) args.push(`--no-${key}`);
        else args = args.concat([`--${key}`, options[key]]);
      }
      args = args.concat(_args.length ? _args.slice(-1) : ['test/**/*.test.*']);
      const spawnParams = spawnArgs(type, {});
      if (spawnParams.options.NODE_OPTIONS || spawnParams.args[0] === '--require') {
        spawn(cmd, spawnParams.args.concat(args), spawnParams.options, cb);
      } else {
        spawn('node', spawnParams.args.concat([cmd]).concat(args), spawnParams.options, cb);
      }      
    });
    queue.await((err) => {
      restore((err2) => {
        cb(err || err2);
      });
    });
  });
};

module.exports.options = { alias: { temp: 't' } };
