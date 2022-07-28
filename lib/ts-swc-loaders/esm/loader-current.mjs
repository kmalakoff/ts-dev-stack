import fs from 'fs';
import path from 'path';

import extensions from '../extensions.js';
import tsConfigRead from '../tsconfig-read-es6.js';
import transformSync from '../transform-sync-es6.js';
import needsCompile from '../needsCompile.js';
import Cache from '../cache.js';

const fileProtocol = 'file://';
const moduleRegEx = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/;

export const resolve = async function (specifier, context, defaultResolve) {
  if (specifier.startsWith('node:')) specifier = specifier.slice(5);

  // directory
  if (specifier.endsWith('/')) {
    const items = fs.readdirSync(specifier);
    for (let item of items) {
      if (!item.startsWith('index.')) continue;
      const extension = path.extname(item);
      if (extensions.indexOf(extension) < 0) continue; // extension not recognized
      if (item !== `index${extension}`) continue; // not index.{ext}
      return await resolve(specifier + 'index' + extension, context, defaultResolve);
    }
  }

  // no extension
  const extension = path.extname(specifier);
  if (!extension) {
    // a module
    if (moduleRegEx.test(specifier)) return await defaultResolve(specifier, context, defaultResolve);

    // guess extension
    for (let extension of extensions) {
      try {
        return await resolve(specifier + extension, context, defaultResolve);
      } catch (err) {
        // skip
      }
    }
  }

  // resolve
  const data = await defaultResolve(specifier, context, defaultResolve);
  if (!data.format) data.format = 'module';
  return data;
};

function endsWith(string, suffix) {
  return string.indexOf(suffix, string.length - suffix.length) !== -1;
}

// lazy create
let tsConfig = null;
let cache = null;

export const load = async function (url, context, defaultLoad) {
  const loaded = await defaultLoad(url, context, defaultLoad);
  if (!loaded.source) return loaded;

  // lazy create
  if (!tsConfig) tsConfig = tsConfigRead(path.resolve(process.cwd(), 'tsconfig.json'));
  if (!cache) cache = new Cache();

  const contents = loaded.source.toString();
  const filename = url.startsWith(fileProtocol) ? url.slice(fileProtocol.length) : url;

  // filter
  if (endsWith(filename, '.d.ts')) return loaded;
  if (extensions.indexOf(path.extname(filename)) < 0) return loaded;
  if (!needsCompile(filename, tsConfig)) return loaded;

  var data = cache.getOrUpdate(cache.cachePath(filename, tsConfig.options), contents, function () {
    return transformSync(contents, filename, tsConfig.options);
  });

  return {
    format: 'module',
    source: data.code,
  };
};
