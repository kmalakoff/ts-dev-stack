var path = require('path');

module.exports = function source(options) {
  var pkg = require(path.resolve(options.cwd || process.cwd(), 'package.json'));
  if (!pkg.source) console.log('Using default source: src/index.ts');
  return (pkg.source ? pkg.source.split('/') : ['src', 'index.ts']).join(path.sep);
}