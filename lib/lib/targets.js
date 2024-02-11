var path = require('path');

module.exports = function targets(options) {
  var pkg = require(path.resolve(options.cwd || process.cwd(), 'package.json'));
  // biome-ignore lint/complexity/useOptionalChain: <explanation>
  if (pkg.tsds && pkg.tsds.targets) return pkg.tsds.targets;
  return ['cjs', 'esm', 'umd'];
};
