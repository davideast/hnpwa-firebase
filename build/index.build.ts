import * as htmlmin from 'html-minifier';
import * as utils from '../functions/utils';

/**
 * Compress any common JavaScript on the index.html page, and
 * compress the HTML. 
 */

const minify = htmlmin.minify;

async function compress() {
   const indexTemplate = await utils.readFile(__dirname + '/index.html');
   const swregTemplate = await utils.readFile(__dirname + '/sw.reg.js');
   const indexReplaced = indexTemplate.replace('/** ::SW_REG **/', swregTemplate);
   const indexMin = minify(indexReplaced, {
      minifyJS: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true
   });
   return utils.writeFile('./functions/index.html', indexMin);
}


compress().then(() => console.log('Created /functions/index.html'));