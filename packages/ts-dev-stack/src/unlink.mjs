import { installPath, unlink } from 'tsds-lib';

export default function unlinkCmd(_args, options, cb) {
  try {
    unlink(installPath(options), cb);
  } catch (err) {
    return cb(err);
  }
}
