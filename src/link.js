var path = require('path');
var link = require('./lib/link');

module.exports = function linkCmd(_args, options, cb) {
  var cwd = options.cwd || process.cwd();
  try {
    var pkg = require(path.resolve(cwd, 'package.json'));
    var installPath = path.resolve(cwd, 'node_modules', pkg.name);
    link(installPath, cb);
  } catch (err) {
    return cb(err);
  }
};
