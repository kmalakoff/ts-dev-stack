import { installPath, link } from 'tsds-lib';

export default function linkCmd(_args, options, cb) {
  try {
    link(installPath(options), cb);
  } catch (err) {
    return cb(err);
  }
}
