import { unlink } from 'link-unlink';
import { installPath } from 'tsds-lib';

export default function command(_args, options, callback) {
    unlink(installPath(options), callback);
}
