/* eslint-disable @typescript-eslint/no-var-requires */
var Queue = require('queue-cb');
var path = require('path');
var rimraf = require('rimraf');

var extensions = require('../lib/extensions');
var spawn = require('../lib/spawn');
var uuid = require('../lib/uuid');
var TMP_DIR = require('../lib/TMP_DIR');

module.exports = function engines(_args, _options, cb) {
  var tests = _args.length ? _args.slice(-1) : ['test/**/*.test.*'];
  var id = uuid();
  var testDir = path.join(TMP_DIR, id, tests[0].split('/')[0]);

  var queue = new Queue(1);
  queue.defer(spawn.bind(null, 'nvu', ['lts', 'node', path.resolve(__dirname, '..', 'lib', 'compileCLI.js'), path.resolve(process.cwd(), 'test'), '--outdir', testDir], {}));
  tests[0] = '.tmp/' + id + '/' + tests[0];
  queue.defer(spawn.bind(null, 'nvu', ['engines', path.resolve(__dirname, '..', '..', 'bin', 'ts-dev-stack.js'), 'test:node', '--temp', tests[0]], {}));
  queue.defer(function (cb) {
    rimraf(TMP_DIR, function () {
      cb();
    });
  });
  queue.await(cb);
};
