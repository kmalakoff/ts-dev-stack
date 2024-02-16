const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const Queue = require('queue-cb');
const assign = require('just-extend');
const spawn = require('../lib/spawn');
const source = require('../lib/source');

module.exports = function docs(_args, options, cb) {
  const cwd = options.cwd || process.cwd();
  const src = source(options);
  const srcFolder = path.dirname(path.resolve(cwd, src));
  const dest = path.resolve(process.cwd(), 'docs');
  const tmpTsConfigPath = path.join(dest, 'tsconfig.json');

  rimraf(dest, () => {
    const queue = new Queue(1);
    queue.defer(mkdirp.bind(null, dest));

    queue.defer((cb) => {
      let tsConfig = require(path.join(cwd, 'tsconfig.json'));
      tsConfig = assign({}, tsConfig, { include: [srcFolder] });
      fs.writeFile(tmpTsConfigPath, JSON.stringify(tsConfig), 'utf8', cb);
    });
    queue.defer(spawn.bind(null, 'typedoc', [src, '--tsconfig', tmpTsConfigPath, '--includeVersion', '--out', 'docs'], {}));
    queue.await(cb);
  });
};
