import path from 'path';
import rimraf2 from 'rimraf2';
import { transformTypes } from 'ts-swc-transform';
import { config } from 'tsds-lib';

export default function cjs(_args, options, cb) {
  const cwd = options.cwd || process.cwd();
  const src = path.dirname(path.resolve(cwd, config(options).source));
  const dest = path.join(cwd, 'dist', 'types');

  rimraf2(dest, { disableGlob: true }, () => {
    transformTypes(src, dest, cb);
  });
}
