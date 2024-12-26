import { installPath, link } from 'tsds-lib';

export default function linkCmd(_args, options, cb) {
  const cwd = options.cwd || process.cwd();
  link(cwd, installPath(options), cb);
}
