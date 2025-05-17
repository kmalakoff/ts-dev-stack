import path from 'path';
import spawn from 'cross-spawn-cb';
import Queue from 'queue-cb';
import concatWritable from '../lib/concatWritable';

const RETRY_MAX = 30;
const RETRY_DELAY = 2000;
const RETRY_ERRORS = /.*(ETARGET|ENOTEMPTY|ENOENT|ECONNRESET).*/;

export default function command(args, options, callback) {
  const cwd = options.cwd || process.cwd();
  const queue = new Queue(1);
  let count = 1;
  function install(cb) {
    console.log(`npm install${count > 1 ? ` (${count})` : ''}`);
    const cp = spawn.crossSpawn('npm', ['install'].concat(args), { encoding: 'utf8', cwd });
    cp.stdout.pipe(process.stdout);
    cp.stderr.pipe(process.stderr);
    const stderr = cp.stderr.pipe(
      concatWritable((output) => {
        stderr.output = output.toString();
      })
    );
    spawn.worker(cp, { encoding: 'utf8' }, (err) => {
      if (!err) return cb();
      if (!stderr.output.match(RETRY_ERRORS)) return cb(err);
      if (++count > RETRY_MAX) return callback(new Error(`Failed to install ${path.basename(cwd)}`));
      queue.defer((cb) => setTimeout(cb, RETRY_DELAY));
      queue.defer(spawn.bind(null, 'npm', ['cache', 'clean', '-f'], { stdio: 'inherit' }));
      queue.defer(install.bind(null));
      cb();
    });
  }
  queue.defer(install.bind(null));
  queue.await(callback);
}
