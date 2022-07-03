var swc = require('@swc/core');
var swcTranspiler = require('ts-node/transpilers/swc');

module.exports = function transformSync(contents, filename, compilerOptions) {
  var transpile = swcTranspiler.create({ swc: swc, service: { config: { options: compilerOptions } } });
  var res = transpile.transpile(contents, { fileName: filename });
  return { code: res.outputText, map: res.sourceMapText };
};
