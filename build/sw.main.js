importScripts('/workbox-sw.prod.v1.0.1.js');

var workboxSW = new self.WorkboxSW();

self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

workboxSW.precache([]);
