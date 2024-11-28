"use strict";
var Queue = require('queue-cb');
var spawn = require('../lib/spawn');
var predeploy = require('./pre');
var postdeploy = require('./post');
module.exports = function deploy(args, options, cb) {
    var npArgs = [];
    if (options['no-publish']) npArgs.push('--no-publish');
    if (options.preview) npArgs.push('--preview');
    if (!options.yarn) npArgs.push('--no-yarn');
    var queue = new Queue(1);
    queue.defer(predeploy.bind(null, args, options));
    queue.defer(spawn.bind(null, 'np', npArgs, {}));
    queue.defer(postdeploy.bind(null, args, options));
    queue.await(cb);
};
module.exports.options = {
    alias: {
        'no-publish': 'np',
        preview: 'p',
        yarn: 'y'
    }
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }