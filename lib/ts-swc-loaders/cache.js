var path = require('path');
var fs = require('fs');
var tmpdir = require('os').tmpdir || require('os-shim').tmpdir;
var mkdirp = require('mkdirp');
var shortHash = require('short-hash');

function unlinkSafe(filePath) {
  try {
    fs.unlinkSync(filePath);
  } catch (_err) {
    // skip
  }
}
function timeMS() {
  return new Date().valueOf();
}
var MS_TO_DAYS = 1000 * 60 * 60 * 24;

function Cache(options) {
  options = options || {};
  this.cwd = process.cwd();
  this.cwdHash = shortHash(process.cwd());
  this.root = options.root || path.join(tmpdir(), 'swc-register');
  this.maxAge = options.maxAge || 1 * MS_TO_DAYS;
}

Cache.prototype.cachePath = function (filePath, options) {
  var relFilePath = path.relative(this.cwd, filePath);
  var basename = path.basename(relFilePath);
  var dirHash = shortHash(path.dirname(relFilePath));
  if (options) basename += '-' + shortHash(JSON.stringify(options || {}));
  return path.join(this.root, this.cwdHash, dirHash, basename + '.json');
};

Cache.prototype.get = function (cachePath) {
  var record = this.getRecord(cachePath);
  return record ? record.data : null;
};

Cache.prototype.getRecord = function (cachePath) {
  try {
    var record = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
    var time = timeMS();
    if (time - record.time > this.maxAge) {
      unlinkSafe(cachePath);
      return null;
    }
    return record;
  } catch (_err) {
    return null;
  }
};

Cache.prototype.getOrUpdate = function getOrUpdate(cachePath, contents, fn) {
  var hash = shortHash(contents);
  var record = this.getRecord(cachePath);
  if (record && record.hash === hash) return record.data;

  // miss
  var data = fn(contents);
  this.set(cachePath, data, { hash: hash });
  return data;
};

Cache.prototype.set = function (cachePath, data, options) {
  options = options || {};
  var record = {
    data: data,
    time: options.time || timeMS(),
    hash: options.hash,
  };
  mkdirp.sync(path.dirname(cachePath));
  fs.writeFileSync(cachePath, JSON.stringify(record), 'utf8');
};

module.exports = Cache;
