/* HRZZ English Fun — offline-first service worker (self-hosted builds only).
   Strategy:
   - App shell (HTML pages, CSS, JS, icon, manifest) is precached on install → works fully offline.
   - Navigations: network-first with a short timeout, falling back to the cached page (so fresh deploys arrive quickly,
     but an offline open still works).
   - Same-origin assets: cache-first (contents are versioned by CACHE below; bump it on every deploy).
   - Third-party (Google Fonts, Chart.js CDN): stale-while-revalidate, cached on first successful load.
   - Learning data lives in IndexedDB and is never touched here. The AI proxy (POST) is never cached.
*/
const CACHE = 'hrzz-v__BUILD__';
const SHELL = [
  '/', '/index.html',
  '/mission/', '/mission/index.html', '/speak/', '/speak/index.html', '/explore/', '/explore/index.html',
  '/progress/', '/progress/index.html', '/coach/', '/coach/index.html', '/settings/', '/settings/index.html', '/play/', '/play/index.html',
  '/assets/theme.css', '/assets/data.js', '/assets/i18n.js', '/assets/core.js', '/assets/app.js',
  '/assets/page-home.js', '/assets/page-mission.js', '/assets/page-speak.js', '/assets/page-play.js', '/assets/page-misc.js',
  '/assets/icon.svg', '/manifest.webmanifest',
];
const THIRD_PARTY = ['fonts.googleapis.com', 'fonts.gstatic.com', 'cdn.moda.app'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('message', (e) => { if (e.data === 'skipWaiting') self.skipWaiting(); });

const timeout = (ms, p) => new Promise((res, rej) => { const t = setTimeout(() => rej(new Error('timeout')), ms); p.then((v) => { clearTimeout(t); res(v); }, (err) => { clearTimeout(t); rej(err); }); });

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return; // AI proxy POSTs etc. go straight to the network
  const url = new URL(req.url);

  // Navigations: network-first (3s), fall back to cached page, then to home.
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const fresh = await timeout(3000, fetch(req));
        if (fresh && fresh.ok) cache.put(req, fresh.clone());
        return fresh;
      } catch (_) {
        const path = url.pathname.endsWith('/') ? url.pathname : url.pathname + '/';
        return (await cache.match(req)) || (await cache.match(path)) || (await cache.match(path + 'index.html')) || (await cache.match('/'));
      }
    })());
    return;
  }

  // Same-origin assets: cache-first.
  if (url.origin === location.origin) {
    e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => { if (res && res.ok) caches.open(CACHE).then((c) => c.put(req, res.clone())); return res; })));
    return;
  }

  // Fonts / Chart.js: stale-while-revalidate (opaque responses are fine to cache).
  if (THIRD_PARTY.some((h) => url.hostname === h)) {
    e.respondWith(caches.open(CACHE).then(async (cache) => {
      const hit = await cache.match(req);
      const net = fetch(req).then((res) => { if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone()); return res; }).catch(() => hit);
      return hit || net;
    }));
  }
});
