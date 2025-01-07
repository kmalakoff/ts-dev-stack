import Module from 'module';

const _require = typeof require === 'undefined' ? Module.createRequire(import.meta.url) : require;

export default function wrapWorker(workerPath: string) {
  return function workerWrapper(version, ...args) {
    if (version === 'local') return _require(workerPath).apply(null, args);

    const callback = args.pop();
    try {
      callback(null, _require('node-version-call').apply(null, [{ version, callbacks: true }, workerPath].concat(args)));
    } catch (err) {
      callback(err);
    }
  };
}
