var path = require('path');
var fs = require('fs');
var Queue = require('queue-cb');
var swc = require('@swc/core');
var once = require('call-once-fn');
var assign = require('just-extend');
var mkdirp = require('mkdirp');

module.exports = function compileFile(entry, options, callback) {
  var swcConfig = assign({}, options.baseConfig, {
    filename: entry.basename,
    module: { type: options.type, noInterop: options.type === 'es6' },
    sourceMaps: options.sourceMaps,
    isModule: true,
  });
  if (options.type === 'es6') swcConfig.jsc.target = 'es2015';
  fs.readFile(entry.fullPath, 'utf8', function (err, contents) {
    if (err) return callback(err);
    callback = once(callback);
    swc
      .transform(contents, swcConfig)
      .then((output) => {
        var relname = entry.path.replace(/\.[^/.]+$/, '');
        var ext = options.type === 'es6' ? '.mjs' : '.js';

        // patch imports for .mjs files
        if (options.type === 'es6') {
          output.code = output.code.replace(/\.js\'\;/g, ".mjs';");
        } else {
          output.code = output.code.replace('exports.default =', 'module.exports =');
        }

        mkdirp(path.dirname(path.join(options.dist, relname + ext)), function () {
          var outQueue = new Queue();
          outQueue.defer(fs.writeFile.bind(null, path.join(options.dist, relname + ext), output.code, 'utf8'));
          !options.sourceMaps || outQueue.defer(fs.writeFile.bind(null, path.join(options.dist, relname + ext + '.map'), output.map, 'utf8'));
          outQueue.await(callback);
          });
      })
      .catch(callback);
  });
};
