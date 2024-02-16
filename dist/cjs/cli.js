"use strict";
var getopts = require("getopts-compat");
var exit = require("exit");
var assign = require("just-extend");
var commands = require("./index");
module.exports = function cli(argv, name) {
    if (argv.length === 0) {
        console.log("Command missing".concat(name, " ").concat(argv.join(",")));
        return exit(-1);
    }
    var command = commands[argv[0]];
    if (!command) {
        console.log("Unrecognized command: ".concat(argv.join(" ")));
        return exit(-1);
    }
    var options = getopts(argv.slice(1), assign({
        stopEarly: true
    }, command.options || {}));
    var args = argv.slice(0, 1).concat(options._);
    command(args.slice(1), options, function(err) {
        if (err) {
            console.log(err.message);
            return exit(err.code || -1);
        }
        exit(0);
    });
};

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}