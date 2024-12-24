// @ts-ignore
import lazy from './lazy.cjs';
const call = lazy('node-version-call');

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
