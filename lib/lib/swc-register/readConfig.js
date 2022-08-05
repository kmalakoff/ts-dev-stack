var fs = require('fs');
var path = require('path');
var ts = require('typescript');

module.exports = function tsConfigRead(tsConfigPath) {
  if (!fs.existsSync(tsConfigPath)) return null;
  var { config } = ts.readConfigFile(tsConfigPath, ts.sys.readFile);
  return ts.parseJsonConfigFileContent(config, ts.sys, path.dirname(tsConfigPath));
};
