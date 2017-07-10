import * as uglify from 'uglify-js';
import * as htmlmin from 'html-minifier';
import * as utils from '../functions/utils';

/**
 * Compress any common JavaScript on the index.html page, and
 * compress the HTML. 
 */

const minify = htmlmin.minify;

async function compress() {
   const indexTemplate = await utils.readFile(process.cwd() + '/build/index.html');
   const swregTemplate = await utils.readFile(process.cwd() + '/src/sw.reg.js');
   const swrefMin = uglify.minify(swregTemplate).code;
   const indexMin = minify(indexTemplate, {
      minifyJS: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true
   });
   return Promise.all([
      utils.writeFile('./functions/index.html', indexMin),
      utils.writeFile('./public/sw.reg.js', swrefMin)
   ]);
}

compress().then(() => console.log('Created /functions/index.html, /public/sw.reg.js'));
