import spawn from 'cross-spawn-cb';
import path from 'path';
import Queue from 'queue-cb';
import type { Writable } from 'stream';
import type { CommandCallback, CommandOptions } from 'tsds-lib';
import concatWritable from './lib/concatWritable.ts';

const RETRY_MAX = 40;
const RETRY_DELAY = 3000;
const RETRY_ERRORS = /.*(ETARGET|ENOTEMPTY|ENOENT|ECONNRESET).*/;

interface WritableOutput extends Writable {
  output?: string;
}

export default function command(args: string[], options: CommandOptions, callback: CommandCallback): undefined {
  const cwd: string = (options.cwd as string) || process.cwd();
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
    ) as WritableOutput;
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
