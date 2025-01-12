import fs from 'fs';
import path from 'path';
import url from 'url';
import spawn from 'cross-spawn-cb';
import getopts from 'getopts-compat';
import Queue from 'queue-cb';
import { wrapWorker } from 'tsds-lib';
import validate from 'tsds-validate';
import hasChanged from './hasChanged';

const __dirname = path.dirname(typeof __filename === 'undefined' ? url.fileURLToPath(import.meta.url) : __filename);
const major = +process.versions.node.split('.')[0];
const version = major > 18 ? 'local' : 'stable';
const dist = path.join(__dirname, '..', '..');
const workerWrapper = wrapWorker(path.join(dist, 'cjs', 'commands.cjs'));

function worker(args, options, callback) {
  const cwd = options.cwd || process.cwd();
  options = { ...options };
  options.package = options.package || JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'));
  if (options.package.private) {
    console.log(`Skipping ${options.package.name}. Private`);
    return callback();
  }

  const opts = getopts(args, { stopEarly: true, alias: { otp: 'o' }, boolean: ['yolo'] });

  const queue = new Queue(1);
  let _skip = false;

  opts.yolo || queue.defer(validate.bind(null, [], options));
  queue.defer((cb) => {
    hasChanged(options, (err, changed) => {
      if (err) return cb(err);
      if (!changed) {
        _skip = true;
        console.log(`Skipping ${options.package.name}. No changes`);
        return cb();
      }

      const versionArgs = ['version', opts._.length >= 0 ? opts._[0] : 'patch'];
      queue.defer((cb) => spawn('npm', versionArgs, options, (err) => { 
        if (err) return cb(err);
        options.package = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'));
        cb();
      }));

      const publishArgs = ['publish'];
      if (opts.otp) Array.prototype.push.apply(publishArgs, [`--otp=${opts.otp}`]);
      queue.defer(spawn.bind(null, 'npm', publishArgs, options));

      queue.defer(spawn.bind(null, 'git', ['add', '.'], options));
      queue.defer(spawn.bind(null, 'git', ['commit', '-m', `"v${options.package.version}"`], options));
      queue.defer(spawn.bind(null, 'git', ['tag', '-a', `"v${options.package.version}"`, `-m"v${options.package.version}"`], options));
      cb();
    });
  });
  queue.await(callback);
}

export default function publish(args, options, callback) {
  major < 14 ? workerWrapper(version, args, options, callback) : worker(args, options, callback);
}
