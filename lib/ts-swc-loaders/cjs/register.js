var path = require('path');
var pirates = require('pirates');
var assign = require('just-extend');

var ts = require('ts-constants');

var extensions = require('../extensions');
var needsCompile = require('../needsCompile');
var Cache = require('../cache');

var call = require('node-version-call');
var major = +process.versions.node.split('.')[0];
var version = major >= 12 ? 'local' : 'lts';
var tsConfigRead = path.dirname(__dirname) + '/tsconfig-read-es6';
var transformSync = path.dirname(__dirname) + '/transform-sync-es6';

function register(options, hookOpts) {
  options = options || {};

  return pirates.addHook(function (code, filename) {
    return compile(code, filename, options);
  }, assign({ exts: extensions }, hookOpts || {}));
}

function endsWith(string, suffix) {
  return string.indexOf(suffix, string.length - suffix.length) !== -1;
}

// lazy create
var tsConfig = null;
var cache = null;

function compile(contents, filename) {
  // lazy create
  if (!tsConfig) {
    tsConfig = call(version, tsConfigRead, path.resolve(process.cwd(), 'tsconfig.json'));

    // overrides for cjs
    if (major < 12) {
      tsConfig.options.module = ts.ModuleKind.CommonJS;
      tsConfig.options.target = ts.ScriptTarget.ES5;
    }
  }
  if (!cache) cache = new Cache();

  // filter
  if (endsWith(filename, '.d.ts')) return ' ';
  if (extensions.indexOf(path.extname(filename)) < 0) return contents || ' ';
  if (!needsCompile(filename, tsConfig)) return contents || ' ';

  var data = cache.getOrUpdate(cache.cachePath(filename, tsConfig.options), contents, function () {
    return call(version, transformSync, contents, filename, tsConfig.options);
  });
  return data.code;
}

module.exports.register = register;
module.exports.compile = compile;
