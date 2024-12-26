import fs from 'fs';
import path from 'path';
import url from 'url';
import Queue from 'queue-cb';
import { link, packageRoot, wrapWorker } from 'tsds-lib';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const major = +process.versions.node.split('.')[0];
const workerWrapper = wrapWorker(path.join(packageRoot(__dirname), 'dist', 'cjs', 'lib', 'data.js'));

function worker(modulePath, nodeModules, _options, callback) {
  const pkg = JSON.parse(fs.readFileSync(path.join(modulePath, 'package.json'), 'utf8'));
  const targetPath = path.resolve(nodeModules, pkg.name);

  const queue = new Queue(1);
  queue.defer(link.bind(null, modulePath, targetPath));

  // single bins
  if (typeof pkg.bin === 'string') {
    const binPath = path.resolve.apply(null, [modulePath, ...pkg.bin.split('/')]);
    const binTargetPath = path.resolve(nodeModules, '.bin', pkg.bin);
    queue.defer(link.bind(null, binPath, binTargetPath));
  }

  // object of bins
  else {
    for (const binName in pkg.bin) {
      const binPath = path.resolve.apply(null, [modulePath, ...pkg.bin[binName].split('/')]);
      const binTargetPath = path.resolve(nodeModules, '.bin', binName);
      queue.defer(link.bind(null, binPath, binTargetPath));
    }
  }

  queue.await((err) => {
    err ? callback(err) : callback(null, targetPath);
  });
}

export default function linkModule(modulePath: string, nodeModules: string, options, callback?) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = options || {};

  major < 14 ? workerWrapper('stable', modulePath, nodeModules, options, callback) : worker(modulePath, nodeModules, options, callback);
}
