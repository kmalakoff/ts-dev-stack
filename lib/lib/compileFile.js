var path = require('path');
var fs = require('fs');
var Queue = require('queue-cb');
var once = require('call-once-fn');
var assign = require('just-extend');
var mkdirp = require('mkdirp');
var swc = require('@swc/core');
var swcTranspiler = require('ts-node/transpilers/swc');
var ts = require('ts-constants');

module.exports = function compileFile(entry, options, callback) {
  fs.readFile(entry.fullPath, 'utf8', function (err, contents) {
    if (err) return callback(err);
    callback = once(callback);

    try {
      var compilerOptions = options.compilerOptions;

      // overrides for cjs
      if (options.type === 'cjs') {
        compilerOptions = assign({}, compilerOptions);
        compilerOptions.module = ts.ModuleKind.CommonJS;
        compilerOptions.target = ts.ScriptTarget.ES5;
      }

      var transpile = swcTranspiler.create({ swc: swc, service: { config: { options: compilerOptions } } });
      var res = transpile.transpile(contents, { fileName: entry.basename });
      var output = { code: res.outputText, map: res.sourceMapText };

      var relname = entry.path.replace(/\.[^/.]+$/, '');
      var ext = options.type === 'esm' ? '.mjs' : '.js';

      // patch .mjs imports
      if (options.type === 'esm') {
        output.code = output.code.replace(/\.(js|ts|tsx|mts)';/g, ".mjs';");
        output.code = output.code.replace(/\.(cts)';/g, ".cjs';");
      }
      // patch .js imports
      else {
        output.code = output.code.replace(/\.(mjs|cjs|ts|tsx|mts|cts)"\)/g, '.js")');
        output.code = output.code.replace(/exports\.default/g, 'module.exports');
      }

      mkdirp(path.dirname(path.join(options.dest, relname + ext)), function () {
        var outQueue = new Queue();
        outQueue.defer(fs.writeFile.bind(null, path.join(options.dest, relname + ext), output.code, 'utf8'));
        !options.sourceMaps || outQueue.defer(fs.writeFile.bind(null, path.join(options.dest, relname + ext + '.map'), output.map, 'utf8'));
        outQueue.await(callback);
      });
    } catch (err) {
      callback(err);
    }
  });
};
