#!/usr/bin/env node
'use strict';

var require$$2 = require('queue-cb');
var require$$0$1 = require('fs');
var require$$0 = require('path');
var require$$3 = require('rimraf2');
var require$$4 = require('ts-swc-transform');
var require$$1 = require('cross-spawn-cb');
var require$$2$1 = require('env-path-key');
var require$$3$1 = require('path-string-prepend');
var require$$1$1 = require('fs-iterator');
var require$$2$2 = require('get-tsconfig-compat');

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var build = {exports: {}};

var cjs = {exports: {}};

function commonjsRequire(path) {
	return require(path);
}

var source = {exports: {}};

var hasRequiredSource;

function requireSource () {
	if (hasRequiredSource) return source.exports;
	hasRequiredSource = 1;
	(function (module, exports) {
		var path = require$$0;
		module.exports = function source(options) {
		    var pkg = commonjsRequire(path.resolve(options.cwd || process.cwd(), 'package.json'));
		    if (!pkg.tsds || !pkg.tsds.source) console.log('Using default source: src/index.ts. Add "tsds": { "source": "src/index.ts" } to your package.json');
		    return (pkg.tsds && pkg.tsds.source ? pkg.tsds.source.split('/') : [
		        'src',
		        'index.ts'
		    ]).join(path.sep);
		};
		/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {} module.exports = exports.default; } 
	} (source, source.exports));
	return source.exports;
}

var hasRequiredCjs;

function requireCjs () {
	if (hasRequiredCjs) return cjs.exports;
	hasRequiredCjs = 1;
	(function (module, exports) {
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
		var fs = require$$0$1;
		var path = require$$0;
		var Queue = require$$2;
		var rimraf2 = require$$3;
		var transformDirectory = require$$4.transformDirectory;
		var source = requireSource();
		module.exports = function cjs(_args, options, cb) {
		    var cwd = options.cwd || process.cwd();
		    options = _object_spread({}, options);
		    options.type = 'cjs';
		    options.sourceMaps = true;
		    options.dest = path.join(cwd, 'dist', 'cjs');
		    rimraf2(options.dest, {
		        disableGlob: true
		    }, function() {
		        var src = source(options);
		        var srcDir = path.dirname(path.resolve(cwd, src));
		        var queue = new Queue(1);
		        queue.defer(transformDirectory.bind(null, srcDir, options.dest, 'cjs', options));
		        queue.defer(fs.writeFile.bind(null, path.join(options.dest, 'package.json'), '{"type":"commonjs"}'));
		        queue.await(cb);
		    });
		};
		/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {} module.exports = exports.default; } 
	} (cjs, cjs.exports));
	return cjs.exports;
}

var esm = {exports: {}};

var hasRequiredEsm;

function requireEsm () {
	if (hasRequiredEsm) return esm.exports;
	hasRequiredEsm = 1;
	(function (module, exports) {
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
		var fs = require$$0$1;
		var path = require$$0;
		var Queue = require$$2;
		var rimraf2 = require$$3;
		var transformDirectory = require$$4.transformDirectory;
		var source = requireSource();
		module.exports = function esm(_args, options, cb) {
		    var cwd = options.cwd || process.cwd();
		    options = _object_spread({}, options);
		    options.type = 'esm';
		    options.sourceMaps = true;
		    options.dest = path.join(cwd, 'dist', 'esm');
		    rimraf2(options.dest, {
		        disableGlob: true
		    }, function() {
		        var src = source(options);
		        var srcDir = path.dirname(path.resolve(cwd, src));
		        var queue = new Queue(1);
		        queue.defer(transformDirectory.bind(null, srcDir, options.dest, 'esm', options));
		        queue.defer(fs.writeFile.bind(null, path.join(options.dest, 'package.json'), '{"type":"module"}'));
		        queue.await(cb);
		    });
		};
		/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {} module.exports = exports.default; } 
	} (esm, esm.exports));
	return esm.exports;
}

var umd = {exports: {}};

var spawn = {exports: {}};

var hasRequiredSpawn;

function requireSpawn () {
	if (hasRequiredSpawn) return spawn.exports;
	hasRequiredSpawn = 1;
	(function (module, exports) {
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
		var path = require$$0;
		var crossSpawn = require$$1;
		var pathKey = require$$2$1;
		var prepend = require$$3$1;
		module.exports = function spawn(cmd, args, options, cb) {
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
		};
		/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {} module.exports = exports.default; } 
	} (spawn, spawn.exports));
	return spawn.exports;
}

var hasRequiredUmd;

function requireUmd () {
	if (hasRequiredUmd) return umd.exports;
	hasRequiredUmd = 1;
	(function (module, exports) {
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
		var fs = require$$0$1;
		var path = require$$0;
		var Queue = require$$2;
		var rimraf2 = require$$3;
		var spawn = requireSpawn();
		var source = requireSource();
		module.exports = function umd(_args, options, cb) {
		    var cwd = options.cwd || process.cwd();
		    var src = path.resolve(cwd, source(options));
		    options = _object_spread({}, options);
		    options.type = 'umd';
		    options.sourceMaps = true;
		    options.dest = path.join(cwd, 'dist', 'umd');
		    rimraf2(options.dest, {
		        disableGlob: true
		    }, function() {
		        var queue = new Queue(1);
		        queue.defer(spawn.bind(null, 'rollup', [
		            '--config',
		            path.resolve(__dirname, '..', '..', 'esm', 'rollup-swc', 'index.mjs'),
		            '--input',
		            src
		        ], {
		            cwd: cwd
		        }));
		        queue.defer(fs.writeFile.bind(null, path.join(options.dest, 'package.json'), '{"type":"commonjs"}'));
		        queue.await(cb);
		    });
		};
		/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {} module.exports = exports.default; } 
	} (umd, umd.exports));
	return umd.exports;
}

var types = {exports: {}};

var hasRequiredTypes;

function requireTypes () {
	if (hasRequiredTypes) return types.exports;
	hasRequiredTypes = 1;
	(function (module, exports) {
		var path = require$$0;
		var Iterator = require$$1$1;
		var getTS = require$$2$2;
		var createMatcher = require$$4.createMatcher;
		var rimraf2 = require$$3;
		var spawn = requireSpawn();
		var source = requireSource();
		module.exports = function types(_args, options, cb) {
		    var cwd = options.cwd || process.cwd();
		    var src = source(options);
		    var srcFolder = path.dirname(path.resolve(cwd, src));
		    var dest = path.join(cwd, 'dist', 'types');
		    var config = getTS.getTsconfig(path.resolve(cwd, 'tsconfig.json'));
		    var matcher = createMatcher(config);
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
		            spawn('tsc', args, {
		                cwd: cwd
		            }, cb);
		        });
		    });
		};
		/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {} module.exports = exports.default; } 
	} (types, types.exports));
	return types.exports;
}

var targets = {exports: {}};

var hasRequiredTargets;

function requireTargets () {
	if (hasRequiredTargets) return targets.exports;
	hasRequiredTargets = 1;
	(function (module, exports) {
		var path = require$$0;
		module.exports = function targets(options) {
		    var pkg = commonjsRequire(path.resolve(options.cwd || process.cwd(), 'package.json'));
		    if (pkg.tsds && pkg.tsds.targets) return pkg.tsds.targets;
		    return [
		        'cjs',
		        'esm',
		        'umd'
		    ];
		};
		/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {} module.exports = exports.default; } 
	} (targets, targets.exports));
	return targets.exports;
}

var hasRequiredBuild;

function requireBuild () {
	if (hasRequiredBuild) return build.exports;
	hasRequiredBuild = 1;
	(function (module, exports) {
		var Queue = require$$2;
		var cjs = requireCjs();
		var esm = requireEsm();
		var umd = requireUmd();
		var types = requireTypes();
		var targets = requireTargets();
		module.exports = function build(args, options, cb) {
		    var targs = targets(options);
		    var queue = new Queue(1);
		    targs.indexOf('cjs') < 0 || queue.defer(cjs.bind(null, args, options));
		    targs.indexOf('esm') < 0 || queue.defer(esm.bind(null, args, options));
		    targs.indexOf('umd') < 0 || queue.defer(umd.bind(null, args, options));
		    queue.defer(types.bind(null, args, options));
		    queue.await(cb);
		};
		/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {} module.exports = exports.default; } 
	} (build, build.exports));
	return build.exports;
}

var buildExports = requireBuild();
var index = /*@__PURE__*/getDefaultExportFromCjs(buildExports);

index(null, {}, (err) => { 
  !err || console.error(err);
})
