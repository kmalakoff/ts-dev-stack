import fs from 'fs';
import path from 'path';
import url from 'url';
import spawn from 'cross-spawn-cb';
import getopts from 'getopts-compat';
import Queue from 'queue-cb';
import { wrapWorker } from 'tsds-lib';
import hasChanged from './lib/hasChanged.js';
import post from './post.js';
import pre from './pre.js';

const major = +process.versions.node.split('.')[0];
const version = major > 14 ? 'local' : 'stable';
const __dirname = path.dirname(typeof __filename === 'undefined' ? url.fileURLToPath(import.meta.url) : __filename);
const dist = path.join(__dirname, '..');
const workerWrapper = wrapWorker(path.join(dist, 'cjs', 'command.js'));

function worker(args, options, callback) {
  const cwd = options.cwd || process.cwd();
  options = { ...options };
  options.package = options.package || JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'));
  if (options.package.private) {
    console.log(`Skipping ${options.package.name}. Private`);
    return callback();
  }

  const opts = getopts(args, { alias: { otp: 'o' }, boolean: ['yolo'] });

  const queue = new Queue(1);

  opts.yolo || queue.defer(pre.bind(null, args, options));
  queue.defer((cb) => {
    hasChanged(options, (err, changed) => {
      if (err) return cb(err);
      if (!changed) {
        console.log(`Skipping ${options.package.name}. No changes`);
        return cb();
      }

      // update the version
      const versionArgs = ['version', opts._.length > 0 ? opts._[0] : 'patch'];
      queue.defer((cb) =>
        spawn('npm', versionArgs, options, (err) => {
          if (err) return cb(err);
          options.package = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'));
          cb();
        })
      );

      // do publish
      const publishArgs = ['publish'];
      if (opts.otp) Array.prototype.push.apply(publishArgs, [`--otp=${opts.otp}`]);
      queue.defer(spawn.bind(null, 'npm', publishArgs, options));

      // add post actions
      queue.defer(post.bind(null, args, options));
      cb();
    });
  });
  queue.await(callback);
}

export default function publish(args, options, callback) {
  version !== 'local' ? workerWrapper(version, args, options, callback) : worker(args, options, callback);
}
