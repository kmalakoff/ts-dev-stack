var path = require('path');
var swc = require('@swc/core');
var tsConfigRead = require('../../lib/tsconfig-read-es6');
var tsConfig = tsConfigRead(path.resolve(process.cwd(), 'tsconfig.json'));
var compilerOptions = tsConfig.options || {};
var swcTranspiler = require('ts-node/transpilers/swc');

const { createFilter } = require('@rollup/pluginutils');
module.exports = function swcPlugin(pluginOptions = {}) {
  const { rollup } = pluginOptions;
  const filter = createFilter(rollup?.include, rollup?.exclude);

  return {
    name: 'swc',
    transform(contents, filename) {
      if (!filter(filename)) return null;

      var transpile = swcTranspiler.create({ swc: swc, service: { config: { options: compilerOptions } } });
      var res = transpile.transpile(contents, { fileName: filename });
      var output = { code: res.outputText, map: res.sourceMapText };
      return output;
    },
  };
};
