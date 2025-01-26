import { esbuildPlugin } from '@web/dev-server-esbuild';
import { importMapsPlugin } from '@web/dev-server-import-maps';
import { playwrightLauncher } from '@web/test-runner-playwright';
import { merge } from 'webpack-merge';

const options = {
  concurrency: 1,
  launchOptions: {
    headless: true,
    devtools: true,
  },
};

export default function createConfig(mergeConfig = {}) {
  const config = {
    browserStartTimeout: 600000, // 10 mins
    testsStartTimeout: 600000, // 10 mins
    nodeResolve: true,
    browsers: [
      playwrightLauncher({
        product: 'chromium',
        ...options,
      }),
      playwrightLauncher({
        product: 'firefox',
        ...options,
      }),
      playwrightLauncher({
        product: 'webkit',
        ...options,
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
