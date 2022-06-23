/* eslint-disable @typescript-eslint/no-var-requires */
var path = require("path");
var fs = require("fs");
var Iterator = require("fs-iterator");

module.exports = function patchESM(_options, cb) {
  var esmPath = path.resolve(process.cwd(), "dist", "esm");
  var iterator = new Iterator(esmPath);
  iterator.forEach((entry, callback) => {
    var index = entry.fullPath.lastIndexOf('.mjs');
    var end = index + 4;
    if (!entry.stats.isFile() || index < 0 || (end !== entry.fullPath.length)) return callback(); 
    fs.readFile(entry.fullPath, 'utf8', function(err, contents) {
      if (err) return callback(err);
      // monkey patch imports from .js to .mjs
      fs.writeFile(entry.fullPath, contents.replace(/\.js\"\;/g, '.mjs";'), 'utf8', callback);
    })
  }, {callbacks: true}, cb)
  };
