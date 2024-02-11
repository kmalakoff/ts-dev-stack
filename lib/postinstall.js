var fs = require('fs');

// make it commonjs
var packageFile = require.resolve('yargs/package.json');
var contents = fs.readFileSync(packageFile, 'utf8');
var pkg = JSON.parse(contents);
pkg.type = 'commonjs';
fs.writeFileSync(packageFile, JSON.stringify(pkg, null, 2), 'utf8');
