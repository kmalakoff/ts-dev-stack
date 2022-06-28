var spawn = require('../../lib/spawn');

module.exports = function types(_options, cb) {
  spawn('tsc', ['--declaration', '--emitDeclarationOnly', '--outDir', 'dist/types'], {}, cb);
};
