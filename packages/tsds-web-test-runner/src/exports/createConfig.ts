/// <reference lib="dom" />
import { esbuildPlugin } from '@web/dev-server-esbuild';
import { importMapsPlugin } from '@web/dev-server-import-maps';
import { playwrightLauncher } from '@web/test-runner-playwright';
import { merge } from 'webpack-merge';

export default function createConfig(mergeConfig = {}) {
  const config = {
    browserStartTimeout: 120000,
    testsStartTimeout: 60000,
    nodeResolve: true,
    browsers: [
      playwrightLauncher({
        product: 'chromium',
      }),
      playwrightLauncher({
        product: 'firefox',
      }),
      playwrightLauncher({
        product: 'webkit',
      }),
    ],
    plugins: [
      importMapsPlugin({
        inject: {
          importMap: {
            imports: {
              assert: 'https://esm.sh/assert',
            },
          },
        },
      }),
      esbuildPlugin({
        loaders: {
          '.ts': 'ts',
          '.tsx': 'tsx',
          '.jsx': 'jsx',
          '.cjs': 'js',
          '.mjs': 'js',
        },
        jsxFactory: 'React.createElement',
        jsxFragment: 'Fragment',
      }),
    ],
  };
  return merge(mergeConfig, config);
}
