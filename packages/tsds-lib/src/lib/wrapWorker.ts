import Module from 'module';
import type nodeVersionCall from 'node-version-call';

const _require = typeof require === 'undefined' ? Module.createRequire(import.meta.url) : require;

import type { Wrapper, WrapperCallback } from '../types.ts';

export default function wrapWorker(workerPath: string): Wrapper {
  return function workerWrapper(version: string, ...args: unknown[]): undefined {
    if (version === 'local') return _require(workerPath).apply(null, args);

    const callback = args.pop() as WrapperCallback;
    try {
      callback(null, (_require('node-version-call') as typeof nodeVersionCall).apply(null, [{ version, callbacks: true }, workerPath, ...args]));
    } catch (err) {
      callback(err);
    }
  };
}
