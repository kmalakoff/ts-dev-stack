import { unlink } from 'link-unlink';
import { installPath } from 'tsds-lib';

export default function unlinkCmd(_args, options, cb) {
  unlink(installPath(options), cb);
}
