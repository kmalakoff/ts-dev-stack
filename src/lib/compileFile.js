const path = require('path');
const fs = require('fs');
const Queue = require('queue-cb');
const once = require('call-once-fn');
const assign = require('just-extend');
const mkdirp = require('mkdirp');

const transformSync = require('ts-swc-loaders/lib/transformSync.js');

// https://github.com/vercel/next.js/blob/20b63e13ab2631d6043277895d373aa31a1b327c/packages/next/taskfile-swc.js#L118-L125
const interopClientDefaultExport = [
  '',
  "if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {",
  "  Object.defineProperty(exports.default, '__esModule', { value: true });",
  '  for (var key in exports) exports.default[key] = exports[key];',
  '  module.exports = exports.default;',
  '}',
].join('\n');

module.exports = function compileFile(entry, options, callback) {
  fs.readFile(entry.fullPath, 'utf8', (err, contents) => {
    if (err) return callback(err);
    callback = once(callback);

    try {
      let config = options.config;

      // overrides for cjs
      if (options.type === 'cjs') {
        config = assign({}, config);
        config.config = assign({}, config.config);
        config.config.compilerOptions = assign({}, config.config.compilerOptions);
        config.config.compilerOptions.module = 'CommonJS';
        config.config.compilerOptions.target = 'ES5';
      }

      const output = transformSync(contents, entry.basename, config);
      const relname = entry.path.replace(/\.[^/.]+$/, '');
      const ext = options.type === 'esm' ? '.mjs' : '.js';

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

      mkdirp(path.dirname(path.join(options.dest, relname + ext)), () => {
        const outQueue = new Queue();
        outQueue.defer(fs.writeFile.bind(null, path.join(options.dest, relname + ext), output.code, 'utf8'));
        !options.sourceMaps || outQueue.defer(fs.writeFile.bind(null, path.join(options.dest, `${relname + ext}.map`), output.map, 'utf8'));
        outQueue.await(callback);
      });
    } catch (err) {
      callback(err);
    }
  });
};
