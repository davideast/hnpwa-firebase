const workbox = require('workbox-build');

function buildSW(matchers) {
  return workbox.injectManifest({
    globDirectory: './src',
    globPatterns: ['**\/*.{html,js,css,png,jpg,json}'],
    globIgnores: ['sw.main.js','404.html', 'images/icons/**/*', 'index.html'],
    swSrc: './build/sw.main.js',
    swDest: './public/sw.main.js',
  });
}

buildSW()
  .then(() => console.log('Created /public/sw.main.js'))
  .catch((e) => console.log(e));
