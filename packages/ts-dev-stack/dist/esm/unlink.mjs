const { unlink, installPath } = require('tsds-lib');
module.exports = function unlinkCmd(_args, options, cb) {
    try {
        unlink(installPath(options), cb);
    } catch (err) {
        return cb(err);
    }
};
