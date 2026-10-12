/* Regen Service Report – offline support.
   Only touches caches whose names start with CACHE_PREFIX, so the other Regen apps
   hosted on the same github.io address keep their offline copies. */
const CACHE_PREFIX = 'regen-service-report-';
const CACHE = CACHE_PREFIX + '1.1.0';
const CDN_CACHE = CACHE_PREFIX + 'cdn';            // libraries and OCR data, kept across app updates
const LOCAL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png', './favicon-32.png'];
const CDN = ['https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js'];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE); await c.addAll(LOCAL);
    const cdn = await caches.open(CDN_CACHE);
    await Promise.all(CDN.map(u => cdn.match(u).then(hit => hit || fetch(u, { mode: 'cors' }).then(r => r.ok && cdn.put(u, r))).catch(() => {})));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith(CACHE_PREFIX) && k !== CACHE && k !== CDN_CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});
const isCdn = u => /^https:\/\/(cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com|fonts\.(googleapis|gstatic)\.com|tessdata\.projectnaptha\.com)\//.test(u);
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    if (!url.pathname.startsWith(new URL(self.registration.scope).pathname)) return;   // another app on this site
    // network first for the page itself so updates arrive; fall back to the stored copy offline
    if (req.mode === 'navigate') {
      e.respondWith(fetch(req).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put('./index.html', cp)); return r; }).catch(() => caches.match('./index.html', { ignoreSearch: true })));
      return;
    }
    e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req)));
    return;
  }
  if (isCdn(req.url)) {   // libraries, fonts and text-recognition data: store on first use
    e.respondWith(caches.open(CDN_CACHE).then(async c => {
      const hit = await c.match(req); if (hit) return hit;
      const r = await fetch(req); if (r.ok || r.type === 'opaque') c.put(req, r.clone()); return r;
    }));
  }
});
