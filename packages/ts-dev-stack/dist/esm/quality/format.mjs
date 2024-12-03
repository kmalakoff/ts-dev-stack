const { spawn } = require('tsds-lib');
module.exports = function format(_args, options, cb) {
    const cwd = options.cwd || process.cwd();
    spawn('npm', [
        'run',
        'format'
    ], {
        cwd
    }, cb);
};
