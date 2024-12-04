(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('path'), require('queue-cb'), require('rimraf2'), require('tsds-lib/assets/tsds-lib.js'), require('fs'), require('ts-swc-transform'), require('fs-iterator'), require('get-tsconfig-compat')) :
  typeof define === 'function' && define.amd ? define(['path', 'queue-cb', 'rimraf2', 'tsds-lib/assets/tsds-lib.js', 'fs', 'ts-swc-transform', 'fs-iterator', 'get-tsconfig-compat'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.tsdsBuild = factory(global.path, global.Queue, global.rimraf2, global.tsdsLib, global.fs, global.tsSwcTransform, global.Iterator, global.getTS));
})(this, (function (path, Queue, rimraf2, tsdsLib, fs, tsSwcTransform, Iterator, getTS) { 'use strict';

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
  function packageRoot(dir, packageName) {
      if (path.basename(dir) === packageName) return dir;
      var nextDir = path.dirname(dir);
      if (nextDir === dir) throw new Error(''.concat(packageName, ' not found'));
      return packageRoot(nextDir, packageName);
  }
  var config = path.resolve(packageRoot(__dirname, 'tsds-build'), 'dist', 'esm', 'rollup-swc', 'index.mjs');
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
              config,
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

  return build;

}));
//# sourceMappingURL=tsds-build.js.map
