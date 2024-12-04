(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('node:path'), require('queue-cb'), require('rimraf2'), require('tsds-lib'), require('node:fs'), require('ts-swc-transform'), require('fs-iterator'), require('get-tsconfig-compat'), require('mkdirp'), require('tsds-mocha')) :
  typeof define === 'function' && define.amd ? define(['exports', 'node:path', 'queue-cb', 'rimraf2', 'tsds-lib', 'node:fs', 'ts-swc-transform', 'fs-iterator', 'get-tsconfig-compat', 'mkdirp', 'tsds-mocha'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.tsDevStack = {}, global.path, global.Queue, global.rimraf2, global.tsdsLib, global.fs, global.tsSwcTransform, global.Iterator, global.getTS, global.mkdirp, global.mocha));
})(this, (function (exports, path, Queue, rimraf2, tsdsLib, fs, tsSwcTransform, Iterator, getTS, mkdirp, mocha) { 'use strict';

  function _define_property$2(obj, key, value) {
      if (key in obj) {
          Object.defineProperty(obj, key, {
              value: value,
              enumerable: true,
              configurable: true,
              writable: true
          });
      } else {
          obj[key] = value;
      }
      return obj;
  }
  function _object_spread$2(target) {
      for(var i = 1; i < arguments.length; i++){
          var source = arguments[i] != null ? arguments[i] : {};
          var ownKeys = Object.keys(source);
          if (typeof Object.getOwnPropertySymbols === "function") {
              ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                  return Object.getOwnPropertyDescriptor(source, sym).enumerable;
              }));
          }
          ownKeys.forEach(function(key) {
              _define_property$2(target, key, source[key]);
          });
      }
      return target;
  }
  function cjs(_args, options, cb) {
      var cwd = options.cwd || process.cwd();
      options = _object_spread$2({}, options);
      options.type = 'cjs';
      options.sourceMaps = true;
      options.dest = path.join(cwd, 'dist', 'cjs');
      rimraf2(options.dest, {
          disableGlob: true
      }, function() {
          var src = tsdsLib.source(options);
          var srcDir = path.dirname(path.resolve(cwd, src));
          var queue = new Queue(1);
          queue.defer(tsSwcTransform.transformDirectory.bind(null, srcDir, options.dest, 'cjs', options));
          queue.defer(fs.writeFile.bind(null, path.join(options.dest, 'package.json'), '{"type":"commonjs"}'));
          queue.await(cb);
      });
  }

  function _define_property$1(obj, key, value) {
      if (key in obj) {
          Object.defineProperty(obj, key, {
              value: value,
              enumerable: true,
              configurable: true,
              writable: true
          });
      } else {
          obj[key] = value;
      }
      return obj;
  }
  function _object_spread$1(target) {
      for(var i = 1; i < arguments.length; i++){
          var source = arguments[i] != null ? arguments[i] : {};
          var ownKeys = Object.keys(source);
          if (typeof Object.getOwnPropertySymbols === "function") {
              ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                  return Object.getOwnPropertyDescriptor(source, sym).enumerable;
              }));
          }
          ownKeys.forEach(function(key) {
              _define_property$1(target, key, source[key]);
          });
      }
      return target;
  }
  function esm(_args, options, cb) {
      var cwd = options.cwd || process.cwd();
      options = _object_spread$1({}, options);
      options.type = 'esm';
      options.sourceMaps = true;
      options.dest = path.join(cwd, 'dist', 'esm');
      rimraf2(options.dest, {
          disableGlob: true
      }, function() {
          var src = tsdsLib.source(options);
          var srcDir = path.dirname(path.resolve(cwd, src));
          var queue = new Queue(1);
          queue.defer(tsSwcTransform.transformDirectory.bind(null, srcDir, options.dest, 'esm', options));
          queue.defer(fs.writeFile.bind(null, path.join(options.dest, 'package.json'), '{"type":"module"}'));
          queue.await(cb);
      });
  }

  function types(_args, options, cb) {
      var cwd = options.cwd || process.cwd();
      var src = tsdsLib.source(options);
      var srcFolder = path.dirname(path.resolve(cwd, src));
      var dest = path.join(cwd, 'dist', 'types');
      var config = getTS.getTsconfig(path.resolve(cwd, 'tsconfig.json'));
      var matcher = tsSwcTransform.createMatcher(config);
      var tsArgs = [];
      for(var key in config.config.compilerOptions){
          var value = config.config.compilerOptions[key];
          tsArgs.push("--".concat(key));
          tsArgs.push(Array.isArray(value) ? value.join(',') : value);
      }
      rimraf2(dest, {
          disableGlob: true
      }, function() {
          var files = [];
          var iterator = new Iterator(srcFolder);
          iterator.forEach(function(entry, callback) {
              if (!entry.stats.isFile()) return callback();
              if (!matcher(entry.fullPath)) return callback();
              files.push(entry.fullPath);
              callback();
          }, {
              callbacks: true,
              concurrency: 1024
          }, function(err) {
              if (err) return cb(err);
              var args = files.concat([
                  '--declaration',
                  '--emitDeclarationOnly',
                  '--outDir',
                  dest
              ]).concat(tsArgs);
              tsdsLib.spawn('tsc', args, {
                  cwd: cwd
              }, cb);
          });
      });
  }

  function _define_property(obj, key, value) {
      if (key in obj) {
          Object.defineProperty(obj, key, {
              value: value,
              enumerable: true,
              configurable: true,
              writable: true
          });
      } else {
          obj[key] = value;
      }
      return obj;
  }
  function _object_spread(target) {
      for(var i = 1; i < arguments.length; i++){
          var source = arguments[i] != null ? arguments[i] : {};
          var ownKeys = Object.keys(source);
          if (typeof Object.getOwnPropertySymbols === "function") {
              ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                  return Object.getOwnPropertyDescriptor(source, sym).enumerable;
              }));
          }
          ownKeys.forEach(function(key) {
              _define_property(target, key, source[key]);
          });
      }
      return target;
  }
  function root(dir) {
      if (path.basename(dir) === 'ts-dev-stack') return dir;
      var nextDir = path.dirname(dir);
      if (nextDir === dir) throw new Error('ts-dev-stack not found');
      return root(nextDir);
  }
  function umd(_args, options, cb) {
      var cwd = options.cwd || process.cwd();
      var src = path.resolve(cwd, tsdsLib.source(options));
      options = _object_spread({}, options);
      options.type = 'umd';
      options.sourceMaps = true;
      options.dest = path.join(cwd, 'dist', 'umd');
      rimraf2(options.dest, {
          disableGlob: true
      }, function() {
          var queue = new Queue(1);
          queue.defer(tsdsLib.spawn.bind(null, 'rollup', [
              '--config',
              path.resolve(root(__dirname), 'dist', 'esm', 'rollup-swc', 'index.mjs'),
              '--input',
              src
          ], {
              cwd: cwd
          }));
          queue.defer(fs.writeFile.bind(null, path.join(options.dest, 'package.json'), '{"type":"commonjs"}'));
          queue.await(cb);
      });
  }

  function build(args, options, cb) {
      var targs = tsdsLib.targets(options);
      var cwd = options.cwd || process.cwd();
      rimraf2(path.join(cwd, 'dist'), {
          disableGlob: true
      }, function() {
          var queue = new Queue(1);
          targs.indexOf('cjs') < 0 || queue.defer(cjs.bind(null, args, options));
          targs.indexOf('esm') < 0 || queue.defer(esm.bind(null, args, options));
          targs.indexOf('umd') < 0 || queue.defer(umd.bind(null, args, options));
          queue.defer(types.bind(null, args, options));
          queue.await(cb);
      });
  }

  var major = +process.versions.node.split('.')[0];
  var mochaName = major < 12 ? 'mocha-compat' : 'mocha';
  var binC8 = null;
  var binMocha = null;
  function c8(_args, options, cb) {
      if (!binC8) binC8 = require.resolve('c8/bin/c8');
      if (!binMocha) binMocha = require.resolve("".concat(mochaName, "/bin/_").concat(mochaName));
      var cwd = options.cwd || process.cwd();
      link(installPath(options), function(err, restore) {
          if (err) return cb(err);
          var queue = new Queue(1);
          queue.defer(function(cb) {
              rimraf2(path.resolve(process.cwd(), {
                  disableGlob: true
              }, 'coverage'), function() {
                  cb();
              });
          });
          queue.defer(function(cb) {
              var args = [
                  binC8,
                  '--config',
                  path.join(__dirname, '..', '..', '..', 'assets', 'c8rc.json')
              ];
              args = args.concat([
                  binMocha,
                  '--watch-extensions',
                  'ts,tsx'
              ]);
              args = args.concat(optionsToArgs(options));
              args = args.concat(_args.length ? _args.slice(-1) : [
                  'test/**/*.test.*'
              ]);
              spawn('ts-swc', args, {
                  cwd: cwd
              }, cb);
          });
          queue.await(function(err) {
              restore(function(err2) {
                  cb(err || err2);
              });
          });
      });
  }

  function post(_args, options, cb) {
      var cwd = options.cwd || process.cwd();
      tsdsLib.spawn('gh-pages', [
          '-d',
          'docs'
      ], {
          cwd: cwd
      }, cb);
  }

  function format(_args, options, cb) {
      var cwd = options.cwd || process.cwd();
      tsdsLib.spawn('npm', [
          'run',
          'format'
      ], {
          cwd: cwd
      }, cb);
  }

  function predeploy(args, options, cb) {
      var cwd = options.cwd || process.cwd();
      var queue = new Queue(1);
      queue.defer(format.bind(null, args, options));
      queue.defer(build.bind(null, args, options));
      queue.defer(tsdsLib.spawn.bind(null, 'sort-package-json', [], {
          cwd: cwd
      }));
      queue.defer(tsdsLib.spawn.bind(null, 'depcheck', [], {
          cwd: cwd
      }));
      queue.await(cb);
  }

  function deploy(args, options, cb) {
      var npArgs = [];
      if (options['no-publish']) npArgs.push('--no-publish');
      if (options.preview) npArgs.push('--preview');
      if (!options.yarn) npArgs.push('--no-yarn');
      var queue = new Queue(1);
      queue.defer(predeploy.bind(null, args, options));
      queue.defer(tsdsLib.spawn.bind(null, 'np', npArgs, {}));
      queue.defer(post.bind(null, args, options));
      queue.await(cb);
  }
  module.exports.options = {
      alias: {
          'no-publish': 'np',
          preview: 'p',
          yarn: 'y'
      }
  };

  function docs(_args, options, cb) {
      var cwd = options.cwd || process.cwd();
      var src = tsdsLib.source(options);
      var dest = path.resolve(process.cwd(), 'docs');
      rimraf2(dest, {
          disableGlob: true
      }, function() {
          var queue = new Queue(1);
          queue.defer(mkdirp.bind(null, dest));
          queue.defer(tsdsLib.spawn.bind(null, 'typedoc', [
              src
          ], {
              cwd: cwd
          }));
          queue.await(cb);
      });
  }

  function linkCmd(_args, options, cb) {
      try {
          tsdsLib.link(tsdsLib.installPath(options), cb);
      } catch (err) {
          return cb(err);
      }
  }

  function karma(args, options, cb) {
      tsdsLib.link(tsdsLib.installPath(options), function(_err, restore) {
          var queue = new Queue(1);
          queue.defer(function(cb) {
              var tests = args.length ? args[0] : 'test/**/*.test.*';
              tsdsLib.spawn('karma', [
                  'start',
                  path.join(__dirname, '..', '..', '..', 'assets', 'karma.conf.js'),
                  tests
              ], {}, cb);
          });
          queue.await(function(err) {
              restore(function(err2) {
                  cb(err || err2);
              });
          });
      });
  }

  // import c8 from './c8.mjs';
  function test(args, options, cb) {
      var queue = new Queue(1);
      queue.defer(mocha.bind(null, args, options));
      queue.defer(karma.bind(null, args, options));
      // queue.defer(c8.bind(null, args, options));
      queue.await(cb);
  }

  function unlinkCmd(_args, options, cb) {
      try {
          tsdsLib.unlink(tsdsLib.installPath(options), cb);
      } catch (err) {
          return cb(err);
      }
  }

  function version(_args, _options, cb) {
      var queue = new Queue(1);
      queue.defer(docs.bind(null, _args, _options));
      queue.defer(tsdsLib.spawn.bind(null, 'git', [
          'add',
          'docs'
      ], {}));
      queue.await(cb);
  }

  exports.testNode = mocha;
  exports.build = build;
  exports.coverage = c8;
  exports.deploy = deploy;
  exports.docs = docs;
  exports.format = format;
  exports.link = linkCmd;
  exports.predeploy = predeploy;
  exports.test = test;
  exports.testBrowser = karma;
  exports.unlink = unlinkCmd;
  exports.version = version;

}));
//# sourceMappingURL=ts-dev-stack.js.map
