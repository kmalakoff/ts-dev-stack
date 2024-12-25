import path from 'path';
import Queue from 'queue-cb';
import rimraf2 from 'rimraf2';
import { transformTypes } from 'ts-swc-transform';
import { config } from 'tsds-lib';

export default function cjs(_args, options, cb) {
  const cwd = options.cwd || process.cwd();
  const src = path.dirname(path.resolve(cwd, config(options).source));
  const dest = path.join(cwd, 'dist', 'types');

  const queue = new Queue(1);
  queue.defer((cb) => rimraf2(dest, { disableGlob: true }, cb.bind(null, null)));
  queue.defer((cb) =>
    transformTypes(src, dest, (err, results) => {
      if (results && results.to) console.log(err ? `Types failed: ${err.message} from ${src}` : `created ${results.to.join(',')}`);
      cb(err);
    })
  );
  queue.await(cb);
}
