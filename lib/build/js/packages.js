/* eslint-disable @typescript-eslint/no-var-requires */
var path = require('path');
var fs = require('fs');
var Queue = require('queue-cb');

module.exports = function packages(_options, cb) {
  var distPath = path.resolve(process.cwd(), 'dist');
  var queue = new Queue();
  queue.defer(fs.writeFile.bind(null, path.join(distPath, 'cjs', 'package.json'), '{ "type": "commonjs" }'));
  queue.defer(fs.writeFile.bind(null, path.join(distPath, 'esm', 'package.json'), '{ "type": "module" }'));
  queue.defer(fs.writeFile.bind(null, path.join(distPath, 'umd', 'package.json'), '{ "type": "commonjs" }'));
  queue.await(cb);
};
