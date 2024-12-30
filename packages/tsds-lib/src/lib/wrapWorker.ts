import Module from 'module';
import lazy from 'lazy-cache';

const _require = typeof require === 'undefined' ? Module.createRequire(import.meta.url) : require;
const call = lazy(_require)('node-version-call');

export default function wrapWorker(workerPath: string) {
  return function workerWrapper(version, ...args) {
    if (version === 'local') return lazy(workerPath)().apply(null, args);

    const callback = args.pop();
    try {
      callback(null, call()({ version, callbacks: true }, workerPath, ...args));
    } catch (err) {
      callback(err);
    }
  };
}
