const path = require('node:path');
module.exports = function targets(options) {
    const pkg = require(path.resolve(options.cwd || process.cwd(), 'package.json'));
    if (pkg.tsds && pkg.tsds.targets) return pkg.tsds.targets;
    return [
        'cjs',
        'esm',
        'umd'
    ];
};
