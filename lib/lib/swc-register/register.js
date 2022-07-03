var path = require('path');
var pirates = require('pirates');
var assign = require('just-extend');

var ts = require('ts-constants');
var Cache = require('./cache');

var extensions = require('../extensions');

var call = require('node-version-call');
var major = +process.versions.node.split('.')[0];
var version = major >= 12 ? 'local' : 'lts';
var tsConfigRead = __dirname + '/../tsconfig-read-es6.js';
var transformSync = __dirname + '/transform-sync-es6.js';
var needsCompile = require('./needsCompile')

function register(options, hookOpts) {
  options = options || {};
  options.cache = options.cache || new Cache();
  if (!options.extensions) options.extensions = extensions;

  if (!options.tsConfig) {
    var filename = path.resolve(process.cwd(), 'tsconfig.json');
    options.tsConfig = call(tsConfigRead, version, { args: [filename] });

    // overrides for cjs
    if (major < 12) {
      options.tsConfig.options.module = ts.ModuleKind.CommonJS;
      options.tsConfig.options.target = ts.ScriptTarget.ES5;
    }
  }

  return pirates.addHook(
    function (code, filename) {
      return compile(code, filename, options);
    },
    assign({exts: options.extensions}, hookOpts || {})
  );
}

var endsWith = function(string, suffix) {
  return string.indexOf(suffix, string.length - suffix.length) !== -1;
};

function compile(contents, filename, options) {
  if (endsWith(filename, '.d.tsConfig')) return '';
  if (options.extensions.indexOf(path.extname(filename)) < 0) return contents;
  if (!needsCompile(filename, options.tsConfig)) return contents;

  var cache = options.cache;
  var data = cache.getOrUpdate(cache.cachePath(filename, options.tsConfig.options), contents, function () {
    return call(transformSync, version, { args: [contents, filename, options.tsConfig.options] });
  });
  return data.code;
}

module.exports.register = register;
module.exports.compile = compile;
