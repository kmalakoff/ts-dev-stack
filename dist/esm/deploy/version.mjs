const Queue = require('queue-cb');
const spawn = require('../lib/spawn');
const docs = require('../docs');
module.exports = function version(_args, _options, cb) {
    const queue = new Queue(1);
    queue.defer(docs.bind(null, _args, _options));
    queue.defer(spawn.bind(null, 'git', [
        'add',
        'docs'
    ], {}));
    queue.await(cb);
};
