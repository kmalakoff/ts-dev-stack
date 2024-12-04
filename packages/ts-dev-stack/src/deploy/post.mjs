import { spawn } from 'tsds-lib';

export default function post(_args, options, cb) {
  const cwd = options.cwd || process.cwd();

  spawn('gh-pages', ['-d', 'docs'], { cwd }, cb);
}
