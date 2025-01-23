import { link } from 'link-unlink';
import { installPath } from 'tsds-lib';

export default function command(_args, options, callback) {
  const cwd = options.cwd || process.cwd();
  link(cwd, installPath(options), callback);
}
