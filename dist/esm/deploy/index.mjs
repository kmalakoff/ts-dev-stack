const Queue = require('queue-cb');
const spawn = require('../lib/spawn');
const predeploy = require('./pre');
const postdeploy = require('./post');
module.exports = function deploy(args, options, cb) {
    const npArgs = [];
    if (options['no-publish']) npArgs.push('--no-publish');
    if (options.preview) npArgs.push('--preview');
    if (!options.yarn) npArgs.push('--no-yarn');
    const queue = new Queue(1);
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
