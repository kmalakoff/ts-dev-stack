var path = require('path');
var unlink = require('./lib/unlink');

module.exports = function linkCmd(_args, options, cb) {
  var cwd = options.cwd || process.cwd();
  try {
    var pkg = require(path.resolve(cwd, 'package.json'));
    var installPath = path.resolve(cwd, 'node_modules', pkg.name);
    unlink(installPath, cb);
  } catch (err) {
    return cb(err);
  }
};
