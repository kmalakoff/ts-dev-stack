import config from './config.js';

export default function targets(options) {
  const tsds = config(options);
  return tsds.targets || ['cjs', 'esm', 'umd'];
}
