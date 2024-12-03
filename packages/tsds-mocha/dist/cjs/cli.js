"use strict";
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
var getopts = require('getopts-compat');
var exit = require('exit');
var commands = require('./index.js');
commands['test:node'] = commands.testNode;
commands['test:browser'] = commands.testBrowser;
module.exports = function cli(argv, name) {
    if (argv.length === 0) {
        console.log("Command missing".concat(name, " ").concat(argv.join(',')));
        return exit(-1);
    }
    var command = commands[argv[0]];
    if (!command) {
        console.log("Unrecognized command: ".concat(argv.join(' ')));
        return exit(-1);
    }
    var options = getopts(argv.slice(1), _object_spread({
        stopEarly: true
    }, command.options || {}));
    var args = argv.slice(0, 1).concat(options._);
    command(args.slice(1), options, function(err) {
        if (err && err.message.indexOf('ExperimentalWarning') < 0) {
            console.log(err.message);
            return exit(err.code || -1);
        }
        exit(0);
    });
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }