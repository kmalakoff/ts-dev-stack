var { convert } = require('tsconfig-to-swcconfig');

module.exports = function baseConfigSWC(options, optionsSWC) {
  var cwd = options.cwd || process.cwd();
  return convert('tsconfig.json', cwd, optionsSWC || {});
};
