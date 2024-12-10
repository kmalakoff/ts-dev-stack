(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('fs'), require('path'), require('mkdirp'), require('queue-cb'), require('resolve'), require('cross-spawn-cb'), require('env-path-key'), require('path-string-prepend')) :
  typeof define === 'function' && define.amd ? define(['exports', 'fs', 'path', 'mkdirp', 'queue-cb', 'resolve', 'cross-spawn-cb', 'env-path-key', 'path-string-prepend'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.tsdsBuild = {}, global.fs, global.path, global.mkdirp, global.Queue, global.resolve, global.crossSpawn, global.pathKey, global.prepend));
})(this, (function (exports, fs, path, mkdirp, Queue, resolve, crossSpawn, pathKey, prepend) { 'use strict';

  function _array_like_to_array(arr, len) {
      if (len == null || len > arr.length) len = arr.length;
      for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
      return arr2;
  }
  function _array_without_holes(arr) {
      if (Array.isArray(arr)) return _array_like_to_array(arr);
  }
  function _iterable_to_array(iter) {
      if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }
  function _non_iterable_spread() {
      throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _to_consumable_array(arr) {
      return _array_without_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array(arr) || _non_iterable_spread();
  }
  function _unsupported_iterable_to_array(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _array_like_to_array(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(n);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
  }
  function binPath(packagePath, binName) {
      var pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      if (!pkg) throw new Error("Module binary package not found. Module: ".concat(packagePath));
      // one of the bin entries
      if (binName) {
          if (typeof pkg.bin[binName] !== 'string') throw new Error("Module binary not found. Module: ".concat(packagePath, ". Binary: ").concat(binName));
          return path.resolve.apply(null, [
              path.dirname(packagePath)
          ].concat(_to_consumable_array(pkg.bin[binName].split('/'))));
      }
      // the bin entry itself
      if (typeof pkg.bin !== 'string') throw new Error("Module binary expecting a path. Module: ".concat(packagePath));
      return path.resolve.apply(null, [
          path.dirname(packagePath)
      ].concat(_to_consumable_array(pkg.bin.split('/'))));
  }

  function config(options) {
      options = options || {};
      var cwd = options.cwd || process.cwd();
      return options.config || JSON.parse(fs.readFileSync(path.resolve(cwd, 'package.json'), 'utf8')).tsds || {};
  }

  var extensions = [
      '.js',
      '.jsx',
      '.es6',
      '.es',
      '.cjs',
      '.mjs',
      '.ts',
      '.tsx',
      '.json'
  ];

  function installPath(options) {
      options = options || {};
      if (options.installPath) return options.installPath;
      var cwd = options.cwd || process.cwd();
      var pkg = JSON.parse(fs.readFileSync(path.resolve(cwd, 'package.json'), 'utf8'));
      return path.resolve(cwd, 'node_modules', pkg.name);
  }

  function unlink(target, cb) {
      var movedPath = path.join(path.dirname(target), "".concat(path.basename(target), ".tsds"));
      var queue = new Queue(1);
      queue.defer(fs.unlink.bind(null, target));
      queue.defer(fs.rename.bind(null, movedPath, target));
      queue.await(function() {
          cb();
      });
  }

  var isWindows = process.platform === 'win32' || /^(msys|cygwin)$/.test(process.env.OSTYPE);
  var symlinkType = isWindows ? 'junction' : 'dir';
  function saveLink(target, cb) {
      var movedPath = path.join(path.dirname(target), "".concat(path.basename(target), ".tsds"));
      var queue = new Queue(1);
      queue.defer(fs.rename.bind(null, target, movedPath));
      queue.defer(createLink.bind(null, target));
      queue.await(cb);
  }
  function createLink(target, cb) {
      var queue = new Queue(1);
      queue.defer(function(cb) {
          mkdirp(path.dirname(target), function() {
              cb();
          });
      });
      queue.defer(fs.symlink.bind(null, process.cwd(), target, symlinkType));
      queue.await(cb);
  }
  function removeLink(target, cb) {
      fs.unlink(target, cb);
  }
  function link(target, cb) {
      try {
          fs.lstat(target, function(_, lstat) {
              // new
              if (!lstat) {
                  createLink(target, function(err) {
                      err ? cb(err) : cb(null, removeLink.bind(null, target));
                  });
              } else if (lstat.isDirectory()) {
                  saveLink(target, function(err) {
                      err ? cb(err) : cb(null, unlink.bind(null, target));
                  });
              } else {
                  removeLink(target, function() {
                      createLink(target, function(err) {
                          err ? cb(err) : cb(null, removeLink.bind(null, target));
                      });
                  });
              }
          });
      } catch (err) {
          return cb(err);
      }
  }

  function optionsToArgs(options) {
      var args = [];
      for(var key in options){
          if (key === '_') continue;
          if (options[key] === true) args.push("--".concat(key));
          else if (options[key] === false) args.push("--no-".concat(key));
          else Array.prototype.push.apply(args, [
              "--".concat(key),
              options[key]
          ]);
      }
      return args;
  }

  function packageRoot(dir, packageName) {
      if (path.basename(dir) === packageName) return dir;
      var nextDir = path.dirname(dir);
      if (nextDir === dir) throw new Error("".concat(packageName, " not found"));
      return packageRoot(nextDir, packageName);
  }

  function packageVersion(name) {
      try {
          var packagePath = resolve.sync("".concat(name, "/package.json"));
          var pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
          return pkg.version;
      } catch (_err) {
          return '';
      }
  }

  function source(options) {
      var tsds = config(options);
      if (!tsds.source) console.log('Using default source: src/index.ts. Add "tsds": { "source": "src/index.ts" } to your package.json');
      return (tsds.source ? tsds.source.split('/') : [
          'src',
          'index.ts'
      ]).join(path.sep);
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
  function ownKeys(object, enumerableOnly) {
      var keys = Object.keys(object);
      if (Object.getOwnPropertySymbols) {
          var symbols = Object.getOwnPropertySymbols(object);
          keys.push.apply(keys, symbols);
      }
      return keys;
  }
  function _object_spread_props(target, source) {
      source = source != null ? source : {};
      if (Object.getOwnPropertyDescriptors) {
          Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
          ownKeys(Object(source)).forEach(function(key) {
              Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
          });
      }
      return target;
  }
  function spawn(cmd, args, options, cb) {
      var cwd = options.cwd || process.cwd();
      var PATH_KEY = pathKey(options);
      var env = _object_spread_props(_object_spread({}, process.env), {
          env: options.env || {}
      });
      env[PATH_KEY] = prepend(env[PATH_KEY] || '', path.resolve(__dirname, '..', '..', '..', '..', '..', 'node_modules', '.bin'));
      env[PATH_KEY] = prepend(env[PATH_KEY] || '', path.resolve(cwd, 'node_modules', '.bin'));
      crossSpawn(cmd, args, {
          stdio: 'inherit',
          cwd: cwd,
          env: env
      }, cb);
  }

  function targets(options) {
      var tsds = config(options);
      return tsds.targets || [
          'cjs',
          'esm',
          'umd'
      ];
  }

  function uuid() {
      return "".concat(new Date().getTime(), "-").concat(Math.floor(Math.random() * 100000));
  }

  exports.binPath = binPath;
  exports.config = config;
  exports.extensions = extensions;
  exports.installPath = installPath;
  exports.link = link;
  exports.optionsToArgs = optionsToArgs;
  exports.packageRoot = packageRoot;
  exports.packageVersion = packageVersion;
  exports.source = source;
  exports.spawn = spawn;
  exports.targets = targets;
  exports.unlink = unlink;
  exports.uuid = uuid;

}));
