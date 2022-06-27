/* eslint-disable @typescript-eslint/no-var-requires */
var path = require('path');
var rimraf = require('rimraf');
var Queue = require('queue-cb');
var assign = require('just-extend');

var lint = require('../../quality/lint');
var swc = require('./swc');
var rollup = require('./rollup');
var packages = require('./packages');
var types = require('./types');
var source = require('../../lib/source');

module.exports = function build(_args, options, cb) {
  options = assign({}, options);
  options.src = source(options);

  var queue = new Queue(1);
  queue.defer(function (cb) {
    rimraf(path.resolve(process.cwd(), 'dist'), function () {
      cb();
    });
  });
  // queue.defer(lint.bind(null, _args, options));
  queue.defer(swc.bind(null, assign({}, options, { type: 'commonjs' })));
  queue.defer(swc.bind(null, assign({}, options, { type: 'es6' })));
  queue.defer(rollup.bind(null, options));
  queue.defer(packages.bind(null, options));
  queue.defer(types.bind(null, options));
  queue.await(cb);
};
