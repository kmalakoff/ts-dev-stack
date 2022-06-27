/* eslint-disable @typescript-eslint/no-var-requires */
var path = require('path');
var spawn = require('../../../lib/spawn');

module.exports = function build(options, cb) {
  var args = ['--config', path.resolve(__dirname, 'rollup-umd.cjs'), '--input', options.src || 'src'];
  spawn('rollup', args, {}, cb);
};
