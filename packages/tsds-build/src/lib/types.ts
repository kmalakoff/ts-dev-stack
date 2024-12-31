import path from 'path';
import Queue from 'queue-cb';
import rimraf2 from 'rimraf2';
import { transformTypes } from 'ts-swc-transform';
import { config } from 'tsds-lib';

const MAX_FILES = 10;
const type = 'types';

export default function cjs(_args, options, cb) {
  const cwd = options.cwd || process.cwd();
  const src = path.dirname(path.resolve(cwd, config(options).source));
  const dest = path.join(cwd, 'dist', type);

  const queue = new Queue(1);
  queue.defer((cb) => rimraf2(dest, { disableGlob: true }, cb.bind(null, null)));
  queue.defer((cb) =>
    transformTypes(src, dest, (err, results) => {
      if (err) console.log(`${type} failed: ${err.message} from ${src}`);
      else console.log(`Created ${results.length < MAX_FILES ? results.map((x) => `dist/${type}/${path.relative(dest, x)}`).join(',') : `${results.length} files in dist/${type}`}`);
      cb(err);
    })
  );
  queue.await(cb);
}
