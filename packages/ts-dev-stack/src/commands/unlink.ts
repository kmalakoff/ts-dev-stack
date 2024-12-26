import { installPath, unlink } from 'tsds-lib';

export default function unlinkCmd(_args, options, cb) {
  unlink(installPath(options), cb);
}
