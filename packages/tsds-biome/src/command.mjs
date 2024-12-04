import { spawn } from 'tsds-lib';

export default function format(_args, options, cb) {
  const cwd = options.cwd || process.cwd();
  spawn('npm', ['run', 'format'], { cwd }, cb);
}
