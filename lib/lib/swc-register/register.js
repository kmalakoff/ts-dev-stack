if (!String.prototype.startsWith) String.prototype.startsWith = require('string.prototype.startswith');
if (!String.prototype.endsWith) String.prototype.endsWith = require('string.prototype.endswith');

var path = require('path');
var pirates = require('pirates');
var assign = require('just-extend');

var ts = require('ts-constants');
var Cache = require('./cache');

var exts = require('../extensions');

var call = require('node-version-call');
var major = +process.versions.node.split('.')[0];
var version = major >= 12 ? 'local' : 'lts';
var tsConfigRead = __dirname + '/../tsconfig-read-es6.js';
var transformSync = __dirname + '/transform-sync-es6.js';

var DIST = path.join(process.cwd(), 'dist');

var cache = new Cache();

function register(options, hookOpts) {
  if (!options) {
    var filename = path.resolve(process.cwd(), 'tsconfig.json');
    options = cache.getOrUpdate(cache.cachePath(filename), require(filename), function () {
      var tsConfig = call(tsConfigRead, version, { args: [filename] });
      return tsConfig.options || {};
    });

    // overrides
    if (major < 12) options.module = ts.ModuleKind.CommonJS;
    if (major < 6) options.target = ts.ScriptTarget.ES5;
  }
  return pirates.addHook(
    function (code, filename) {
      return compile(code, filename, options);
    },
    hookOpts ? assign({ exts: exts }, hookOpts) : { exts: exts }
  );
}

function compile(contents, filename, options) {
  if (filename.endsWith('.d.ts')) return '';
  if (filename.startsWith(DIST)) return contents;
  if (exts.indexOf(path.extname(filename)) < 0) return '';

  var data = cache.getOrUpdate(cache.cachePath(filename, options), contents, function () {
    return call(transformSync, version, { args: [contents, filename, options] });
  });
  return data.code;
}

module.exports.register = register;
module.exports.compile = compile;
