import fs from 'fs';
import path from 'path';
import url from 'url';
import access from 'fs-access-compat';
import Queue from 'queue-cb';
import { packageRoot, unlink, wrapWorker } from 'tsds-lib';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const major = +process.versions.node.split('.')[0];
const workerWrapper = wrapWorker(path.join(packageRoot(__dirname), 'dist', 'cjs', 'lib', 'data.js'));

function unlinkBin(nodeModules, binName, callback) {
  const destBin = path.resolve(nodeModules, '.bin', binName);

  access(destBin, (err) => {
    if (!err) return unlink(destBin, callback);
    console.log(`bin not found: ${destBin}. Skipping`);
    callback();
  });
}

function worker(src, nodeModules, _options, callback) {
  const pkg = JSON.parse(fs.readFileSync(path.join(src, 'package.json'), 'utf8'));
  const dest = path.resolve.apply(null, [nodeModules, ...pkg.name.split('/')]);

  const queue = new Queue(1);
  queue.defer(unlink.bind(null, dest));

  if (typeof pkg.bin === 'string')
    queue.defer(unlinkBin.bind(null, nodeModules, pkg.name)); // single bins
  else for (const binName in pkg.bin) queue.defer(unlinkBin.bind(null, nodeModules, binName)); // object of bins

  queue.await((err) => {
    err ? callback(err) : callback(null, dest);
  });
}

export default function unlinkModule(src: string, nodeModules: string, options, callback?) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = options || {};

  major < 14 ? workerWrapper('stable', src, nodeModules, options, callback) : worker(src, nodeModules, options, callback);
}
