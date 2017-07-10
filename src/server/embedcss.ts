import * as utils from './utils';
const csso: { minify(css: string): { css: string } } = require('csso');

const EMBED_REPLACE_TOKEN = /<!-- ::EMBEDDED-STYLES:: -->/;
export async function combineCss(cssFiles: string[]) {
  const cssPromises = await cssFiles.map((path: string) => utils.readFile(path));
  const cssContent = await Promise.all(cssPromises);
  const cssCombined = cssContent.join('\n');
  const compressedCss = csso.minify(cssCombined).css;
  return compressedCss;
}

export async function embedInHtml(htmlFile: string, styleTagFile: string, token = EMBED_REPLACE_TOKEN) {
  const tag = await utils.readFile(styleTagFile);
  const html = await utils.readFile(htmlFile);
  const replaced = html.replace(EMBED_REPLACE_TOKEN, tag);
  return replaced;
}

export function style(styles: string) {
  const tag = `<style media="screen">/** ::STYLES:: **/</style>`;
  const replaced = tag.replace('/** ::STYLES:: **/', styles);
  return replaced;
}

