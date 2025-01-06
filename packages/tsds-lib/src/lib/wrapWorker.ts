import Module from 'module';
import lazy from 'lazy-cache';

const _require = typeof require === 'undefined' ? Module.createRequire(import.meta.url) : require;
const callLazy = lazy(_require)('node-version-call');

export default function wrapWorker(workerPath: string) {
  const workerLazy = lazy(_require)(workerPath);

  return function workerWrapper(version) {
    // biome-ignore lint/style/noArguments: <explanation>
    const args = Array.prototype.slice.call(arguments, 1);
    if (version === 'local') return workerLazy().apply(null, args);

    const callback = args.pop();
    try {
      callback(null, callLazy().apply(null, [{ version, callbacks: true }, workerPath].concat(args)));
    } catch (err) {
      callback(err);
    }
  };
}
