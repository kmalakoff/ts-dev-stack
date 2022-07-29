import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

import extensions from '../extensions.js';
import tsConfigRead from '../tsconfig-read-es6.js';
import transformSync from '../transform-sync-es6.js';
import needsCompile from '../needsCompile.js';
import packageType from '../packageType.js';
import Cache from '../cache.js';

const moduleRegEx = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/;
const indexExtensions = extensions.map((x) => `index${x}`);

export const resolve = async function (specifier, context, defaultResolve) {
  if (specifier.startsWith('node:')) specifier = specifier.slice(5);

  // no extension
  const extension = path.extname(specifier);
  if (!extension) {
    // directory
    if (specifier.endsWith('/')) {
      const items = fs.readdirSync(specifier);
      for (let item of items) {
        if (indexExtensions.indexOf(item) >= 0) {
          return await resolve(specifier + 'index' + extension, context, defaultResolve);
        }
      }
    }

    // a module
    else if (moduleRegEx.test(specifier)) return await defaultResolve(specifier, context, defaultResolve);
    // guess extension
    else {
      for (let extension of extensions) {
        try {
          return await resolve(specifier + extension, context, defaultResolve);
        } catch (err) {
          // skip
        }
      }
    }

    throw new Error('Cannot resolve: ' + specifier);
  }

  // resolve
  const data = await defaultResolve(specifier, context, defaultResolve);
  if (!data.format) {
    const url = context.parentURL ? new URL(specifier, context.parentURL).href : new URL(specifier).href;
    data.format = packageType(url);
  }
  return data;
};

// lazy create
let tsConfig = null;
let cache = null;

export const load = async function (url, context, defaultLoad) {
  if (path.isAbsolute(url)) url = pathToFileURL(url); // windows

  const loaded = await defaultLoad(url, context, defaultLoad);
  if (!loaded.source) return loaded;
  const filePath = url.startsWith('file://') ? url.slice(7) : url;

  // lazy create
  if (!tsConfig) tsConfig = tsConfigRead(path.resolve(process.cwd(), 'tsconfig.json'));
  if (!cache) cache = new Cache();

  // filter
  if (filePath.endsWith('.d.ts')) return { format: 'module', source: '' };
  if (extensions.indexOf(path.extname(filePath)) < 0) return loaded;
  if (!needsCompile(filePath, tsConfig)) return loaded;

  const contents = loaded.source.toString();
  var data = cache.getOrUpdate(cache.cachePath(filePath, tsConfig.options), contents, function () {
    return transformSync(contents, filePath, tsConfig.options);
  });

  return {
    format: 'module',
    source: data.code,
  };
};
