export const commands = {
  build: 'tsds-build',
  coverage: 'tsds-c8',
  publish: './commands/publish.cjs',
  docs: 'tsds-typedoc',
  format: 'tsds-biome',
  link: './commands/link.cjs',
  'test:node': 'tsds-mocha',
  'test:browser': 'tsds-web-test-runner',
  unlink: './commands/unlink.cjs',
  validate: './commands/validate.cjs',
  version: './commands/version.cjs',
};
