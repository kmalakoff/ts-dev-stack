var path = require('path');
var getTS = require('get-tsconfig-compat');

var transformSync = require('ts-swc-loaders/lib/transformSync.js');
// var createMatcher = require('ts-swc-loaders/lib/createMatcher.js');

var config = getTS.getTsconfig(path.resolve(process.cwd(), 'tsconfig.json'));
config.config.compilerOptions.target = 'ES5';

// var matcher = createMatcher(config);

module.exports = function swcPlugin() {
  return {
    name: 'swc',
    transform(contents, filename) {
      // TODO: test includes works:
      // "include": ["src", "test", "node_modules/index-of-newline"]
      // if (!matcher(filename)) return null;

      return transformSync(contents, filename, config);
    },
  };
};
