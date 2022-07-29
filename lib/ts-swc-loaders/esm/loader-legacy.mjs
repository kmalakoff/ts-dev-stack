import path from 'path';
import { pathToFileURL } from 'url';

import extensions from '../extensions.js';
import tsConfigRead from '../tsconfig-read-es6.js';
import transformSync from '../transform-sync-es6.js';
import needsCompile from '../needsCompile.js';
import packageType from '../packageType.js';
import Cache from '../cache.js';

const EXT_TO_FORMAT = {
  '.mjs': 'module',
  '.mts': 'module',
  '.cjs': 'commonjs',
  '.cts': 'commonjs',
};

async function _getFormat(url, context, defaultGetFormat) {
  if (url.startsWith('file://')) {
    const extension = path.extname(url);
    const format = EXT_TO_FORMAT[extension] || packageType(url);
    return { format };
  }
  return await defaultGetFormat(url, context, defaultGetFormat);
}

// lazy create
let tsConfig = null;
let cache = null;

async function _transformSource(source, context, defaultTransformSource) {
  const { url } = context;
  const filePath = url.startsWith('file://') ? url.slice(7) : url;
  const loaded = await defaultTransformSource(source, context, defaultTransformSource);

  // lazy create
  if (!tsConfig) tsConfig = tsConfigRead(path.resolve(process.cwd(), 'tsconfig.json'));
  if (!cache) cache = new Cache();

  // filter
  if (filePath.endsWith('.d.ts')) return { source: '' };
  if (extensions.indexOf(path.extname(filePath)) < 0) return loaded;
  if (!needsCompile(filePath, tsConfig)) return loaded;

  const contents = loaded.source.toString();
  var data = cache.getOrUpdate(cache.cachePath(filePath, tsConfig.options), contents, function () {
    return transformSync(contents, filePath, tsConfig.options);
  });

  return {
    source: data.code,
  };
}

var major = +process.versions.node.split('.')[0];

export const getFormat = major < 16 ? _getFormat : undefined;
export const transformSource = major < 16 ? _transformSource : undefined;
