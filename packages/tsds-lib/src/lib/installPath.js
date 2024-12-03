const path = require('path');

module.exports = function installPath(options) {
  options = options || {};
  if (options.installPath) return options.installPath;
  const cwd = options.cwd || process.cwd();
  const pkg = require(path.resolve(cwd, 'package.json'));
  return path.resolve(cwd, 'node_modules', pkg.name);
};
