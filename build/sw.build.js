const workbox = require('workbox-build');

function buildSW() {
  return workbox.injectManifest({
    globDirectory: './src/',
    globPatterns: ['**\/*.{html,js,css,png,jpg}'],
    globIgnores: ['sw.main.js','404.html', 'images/icons/**/*'],
    swSrc: './build/sw.main.js',
    swDest: './public/sw.main.js',
    templatedUrls: {
      '/': ['index.html'],
      '/news': ['index.html'],
      '/ask': ['index.html'],
      '/show': ['index.html'],
      '/jobs': ['index.html'],
    },
  });
}

buildSW()
  .then(() => console.log('created public/sw.main.js'))
  .catch(console.log);
