/* eslint-disable @typescript-eslint/no-var-requires */
var Queue = require('queue-cb');
var spawn = require('../lib/spawn');
var predeploy = require('./predeploy');
var postdeploy = require('./postdeploy');

module.exports = function deploy(args, options, cb) {
  var npArgs = [];
  if (options['no-publish']) npArgs.push('--no-publish')
  if (options['preview']) npArgs.push('--preview')
  if (!options.yarn) npArgs.push('--no-yarn')

  console.log(options, npArgs)
  
  var queue = new Queue(1);
  queue.defer(predeploy.bind(null, args, options));
  queue.defer(spawn.bind(null, 'np', npArgs, {}));
  queue.defer(postdeploy.bind(null, args, options));
  queue.await(cb);
};

module.exports.options = { alias: { 'no-publish': 'np', 'preview': 'p', 'yarn': 'y' } };

