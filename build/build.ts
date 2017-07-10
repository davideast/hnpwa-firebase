import { WorkboxBuild, Manifest } from './workbox.types';
import * as embed from '../functions/css/embedcss';
const workbox: WorkboxBuild = require('workbox-build');
const PRECACHE_MATCHER = '/** ::MANIFEST:: **/';

import * as uglify from 'uglify-js';
import * as htmlmin from 'html-minifier';
import * as utils from '../functions/utils';

const minify = htmlmin.minify;

/**
 * Generate precache entries for the ServiceWorker
 */
function generateEntries() {
  return workbox.getFileManifestEntries({
    globDirectory: './src',
    globPatterns: ['**\/*.{html,js,css,png,jpg,json}'],
    globIgnores: ['sw.main.js','404.html', 'images/icons/**/*', 'index.html'],
  });
}

/**
 * Generate top level Service Worker given precache entries
 * @param entries 
 */
async function createMinifiedSW(entries: Manifest[]) {
  const swTemplate = await utils.readFile(process.cwd() + '/build/sw.main.js');
  const replacedTemplate = swTemplate.replace(PRECACHE_MATCHER, JSON.stringify(entries)); 
  const data = uglify.minify(replacedTemplate).code;
  const path = process.cwd() + '/public/sw.main.js';
  return [{ data,  path }];
}

async function createMinifiedSWRegistration() {
  const swregTemplate = await utils.readFile(process.cwd() + '/src/sw.reg.js');
  const data = uglify.minify(swregTemplate).code;
  const path = process.cwd() + '/public/sw.reg.js'; 
  return [{ data,  path }];
}

async function createCompressedIndex() {
   const indexTemplate = await utils.readFile(process.cwd() + '/build/index.html');
   const data = minify(indexTemplate, {
      minifyJS: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true
   });
   const path = process.cwd() + '/functions/index.html';
   return [{data, path }];
}

/**
 * Build Steps
 * (assume tsc has ran)
 * 1. Generate SW entries
 * 2. Generate SW from entries
 * 3. Minify SW
 * 4. Minify SW registration
 * 5. Minify index.html
 * 6. Generate CSS HTML tags, write to functions/css
 */
async function build() {
  const entries = await generateEntries();
  const sw = await createMinifiedSW(entries);
  const reg = await createMinifiedSWRegistration();
  const index = await createCompressedIndex();
  const css = await embed.generateStyles();
  const all = sw.concat(reg, index, css);
  return all.map(file => {
    console.log(`Writing ${file.path}.`);
    return utils.writeFile(file.path, file.data)
  });
}

try {
  build();
} catch(e) {
  console.log(e);
}
