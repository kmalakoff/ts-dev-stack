var path = require('path');

function findPackage(url) {
  var filePath = url.startsWith('file://') ? url.slice(7) : url;

  while (filePath.length) {
    var packagePath = path.join(filePath, 'package.json');
    if (packagePath.endsWith('/node_modules/package.json')) break;

    try {
      return require(packagePath);
    } catch (err) {
      // skip
    }

    filePath = path.dirname(filePath);
  }

  return {};
}

module.exports = function packageType(url) {
  var pkg = findPackage(url);
  return pkg.type || 'commonjs';
};
