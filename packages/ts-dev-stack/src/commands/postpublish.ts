import { spawn, which } from 'tsds-lib';

export default function postpublish(_args, options, callback) {
  const cwd = options.cwd || process.cwd();
  which('gh-pages', options, (err, docs) => {
    err ? callback(err) : spawn(docs, ['-d', 'docs'], { cwd }, callback);
  });
}
