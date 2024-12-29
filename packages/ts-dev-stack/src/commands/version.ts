import path from 'path';
import url from 'url';
import spawn from 'cross-spawn-cb';
import moduleRoot from 'module-root-sync';
import { prependEnvPath } from 'module-which';
import Queue from 'queue-cb';
import docs from 'tsds-typedoc';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const root = moduleRoot(__dirname);

export default function version(args, options, callback) {
  const cwd = options.cwd || process.cwd();
  const { envPath, pathKey } = prependEnvPath({ root, ...options });
  const env = { ...(options.env || process.env), [pathKey]: envPath };

  const queue = new Queue(1);
  queue.defer(docs.bind(null, args, options));
  queue.defer(spawn.bind(null, 'gh-pages', ['-d', 'docs'], { cwd, env }));
  queue.await(callback);
}
