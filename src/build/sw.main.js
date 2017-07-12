importScripts('/workbox-sw.prod.v1.0.1.js');
var w = new self.WorkboxSW();
self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
w.precache([/** ::MANIFEST:: **/]);
w.router.registerRoute('/', w.strategies.networkFirst());
w.router.registerRoute(/^\/$|news|newest|show|ask|jobs|item/, w.strategies.staleWhileRevalidate());
