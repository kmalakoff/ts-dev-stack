import config from './config';

export default function targets(options) {
  const tsds = config(options);
  return tsds.targets || ['cjs', 'esm', 'umd'];
}
