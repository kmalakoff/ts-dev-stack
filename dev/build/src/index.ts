import fs from 'fs';
import path from 'path';
import Queue from 'queue-cb';
import rimraf2 from 'rimraf2';
import files from './files';

export default function build(callback) {
  const cwd = process.cwd();
  const config = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8')).tsds;

  const queue = new Queue(1);
  queue.defer(rimraf2.bind(null, path.join(cwd, 'dist'), { disableGlob: true }));
  queue.defer((cb) => files(config, 'cjs', {}, cb));
  queue.defer((cb) => files(config, 'esm', {}, cb));
  queue.await(callback);
}
