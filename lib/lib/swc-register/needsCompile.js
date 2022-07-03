var path = require('path');
var os = require('os');
var platform = os.platform();

module.exports = function needsCompile(filename, options) {
  var cwd = process.cwd();
  for (var i = 0; i < options.fileNames.length; i++) {
    var fileName = platform === 'win32' ? path.resolve(cwd, options.fileNames[i]) : options.fileNames[i];
    if (filename === fileName) return true;
  }
  return false;
};
