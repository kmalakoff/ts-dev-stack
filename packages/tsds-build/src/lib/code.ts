import fs from 'fs';
import path from 'path';
import Queue from 'queue-cb';
import rimraf2 from 'rimraf2';
import { transformDirectory } from 'ts-swc-transform';
import { config } from 'tsds-lib';

const MAX_FILES = 10;

export default function transform(_args, type, options, cb) {
  const cwd = options.cwd || process.cwd();
  const src = path.dirname(path.resolve(cwd, config(options).source));
  const dest = path.join(cwd, 'dist', type);

  const queue = new Queue(1);
  queue.defer((cb) => rimraf2(dest, { disableGlob: true }, cb.bind(null, null)));
  queue.defer((cb) =>
    transformDirectory(src, dest, type, { ...options, type, sourceMaps: true }, (err, results) => {
      if (err) console.log(`${type} failed: ${err.message} from ${src}`);
      else console.log(`Created ${results.length < MAX_FILES ? results.map((x) => `dist/${type}${x.to}`).join(',') : `${results.length} files in dist/${type}`}`);
      cb(err);
    })
  );
  queue.defer(fs.writeFile.bind(null, path.join(dest, 'package.json'), '{"type":"commonjs"}'));
  queue.await(cb);
}
