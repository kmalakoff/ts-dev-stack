/* eslint-disable @typescript-eslint/no-var-requires */
var path = require('path');
var Queue = require('queue-cb');
var rimraf = require('rimraf');

var link = require('../../lib/link');
var extensions = require('../../lib/extensions');
var spawn = require('../../lib/spawn');
var uuid = require('../../lib/uuid');
var TMP_DIR = require('../../lib/TMP_DIR');

var major = +process.versions.node.split('.')[0];

module.exports = function mocha(_args, options, cb) {
  link(function (err) {
    if (err) return cb(err);
    var tests = _args.length ? _args.slice(-1) : ['test/**/*.test.*'];
    if (major < 12) {
      var queue = new Queue(1);
      if (options.temp) tests = [options.temp];
      else {
        var id = uuid();
        var testDir = path.join(TMP_DIR, id, tests[0].split('/')[0]);
        queue.defer(spawn.bind(null, 'nvu', ['lts', 'node', path.resolve(__dirname, '..', 'lib', 'compileCLI.js'), path.resolve(process.cwd(), 'test'), '--outdir', testDir], {}));
        tests[0] = '.tmp/' + id + '/' + tests[0];
      }
      queue.defer(spawn.bind(null, 'mocha-compat', tests, {}));
      if (!options.temp) {
        queue.defer(function (cb) {
          rimraf(path.dirname(testDir), function () {
            cb();
          });
        });
      }
      return queue.await(cb);
      // TODO: put back loader
    // } else if (major < 12) {
    //   return spawn('mocha-compat', ['--require', path.resolve(__dirname, 'cjs', 'babel-register.cjs')].concat(tests), { env: { BABEL_ENV: 'cjs' } }, cb);
    } else {
      return spawn('mocha', ['--config', path.resolve(__dirname, 'esm', 'mocharc.json')].concat(tests), { env: { BABEL_ENV: 'cjs' } }, cb);
    }
  });
};

module.exports.options = { alias: { temp: 't' } };
