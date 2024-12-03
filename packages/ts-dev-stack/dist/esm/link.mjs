const { link, installPath } = require('tsds-lib');
module.exports = function linkCmd(_args, options, cb) {
    try {
        link(installPath(options), cb);
    } catch (err) {
        return cb(err);
    }
};
