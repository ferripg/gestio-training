/* Service worker: cache dels fitxers de l'app perquè funcioni offline.
   Estratègia "network-first": amb connexió, sempre la versió nova (i s'actualitza el cache);
   sense connexió, la versió guardada. Així els canvis arriben a la PRIMERA obertura. */

const CACHE = 'gestio-training-v4';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './charts.js',
  './program.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.open(CACHE).then(async cache => {
      try {
        const res = await fetch(req, { cache: 'no-cache' });
        if (res.ok) cache.put(req, res.clone());
        return res;
      } catch (e) {
        const cached = await cache.match(req);
        return cached || (req.mode === 'navigate' ? cache.match('./index.html') : Response.error());
      }
    })
  );
});
