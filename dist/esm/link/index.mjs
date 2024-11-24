const path = require('node:path');
const link = require('./link');
module.exports = function linkCmd(_args, options, cb) {
    const cwd = options.cwd || process.cwd();
    try {
        const pkg = require(path.resolve(cwd, 'package.json'));
        const installPath = options.installPath || path.resolve(cwd, 'node_modules', pkg.name);
        link(installPath, cb);
    } catch (err) {
        return cb(err);
    }
};
