var { convert } = require('tsconfig-to-swcconfig');

module.exports = function baseConfig(options) {
  var cwd = options.cwd || process.cwd();
  return convert('tsconfig.json', cwd, {});
};
