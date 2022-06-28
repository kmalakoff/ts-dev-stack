const getopts = require('getopts-compat');
const Iterator = require('fs-iterator');
const compileFile = require('../build/js/directory/compileFile');

const _options = getopts(process.argv.slice(2));
const src = process.argv[2];

const typeEnds = ['.d.ts', '.d.tsx', '.mjs'];
const options = { dist: _options.outdir };

const iterator = new Iterator(src);
iterator.forEach(
  (entry, callback) => {
    if (!entry.stats.isFile()) return callback();
    if (typeEnds.some((x) => entry.basename.endsWith(x))) return callback();
    compileFile(entry, { dist: options.dist, type: 'commonjs' }, callback);
  },
  { concurrency: 1024, callbacks: true },
  function (err) {
    return process.exit(err ? 1 : 0);
  }
);
