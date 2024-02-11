var path = require('path');

module.exports = function source(options) {
  var pkg = require(path.resolve(options.cwd || process.cwd(), 'package.json'));
  if (!pkg.tsds || !pkg.tsds.source) console.log('Using default source: src/index.ts. Add "tsds": { "source": "src/index.ts" } to your package.json');

  return (pkg.tsds && pkg.tsds.source ? pkg.tsds.source.split('/') : ['src', 'index.ts']).join(path.sep);
};
