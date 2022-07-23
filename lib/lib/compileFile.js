var path = require('path');
var fs = require('fs');
var Queue = require('queue-cb');
var once = require('call-once-fn');
var assign = require('just-extend');
var mkdirp = require('mkdirp');
var ts = require('ts-constants');

// https://github.com/vercel/next.js/blob/20b63e13ab2631d6043277895d373aa31a1b327c/packages/next/taskfile-swc.js#L118-L125
var interopClientDefaultExport = [
  "",
  "if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {",
  "  Object.defineProperty(exports.default, '__esModule', { value: true });",
  '  Object.assign(exports.default, exports);',
  '  module.exports = exports.default;',
  '}',
].join('\n');

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

      var transpile = require('ts-node/transpilers/swc').create({ swc: require('@swc/core'), service: { config: { options: compilerOptions } } });
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
        output.code += interopClientDefaultExport;
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
