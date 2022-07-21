var path = require('path');
var swc = require('@swc/core');
var ts = require('ts-constants');
var tsConfigRead = require('../../lib/tsconfig-read-es6');
var tsConfig = tsConfigRead(path.resolve(process.cwd(), 'tsconfig.json'));
var swcTranspiler = require('ts-node/transpilers/swc');
// var needsCompile = require('../../lib/swc-register/needsCompile');

module.exports = function swcPlugin() {
  // overrides
  tsConfig.options.target = ts.ScriptTarget.ES5;

  return {
    name: 'swc',
    transform(contents, filename) {
      // TODO: test includes works:
      // "include": ["src", "test", "node_modules/index-of-newline"]
      // if (!needsCompile(filename, tsConfig)) return null;

      var transpile = swcTranspiler.create({ swc: swc, service: { config: { options: tsConfig.options } } });
      var res = transpile.transpile(contents, { fileName: filename });
      var output = { code: res.outputText, map: res.sourceMapText };
      return output;
    },
  };
};
