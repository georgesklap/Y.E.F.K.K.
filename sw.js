const CACHE_NAME = 'yefkk-48-20261118-v1';
// Μόνο αρχεία που χρησιμοποιεί η εφαρμογή. Τα './' και './index.html' είναι υποχρεωτικά·
// τα υπόλοιπα αποθηκεύονται ένα-ένα, ώστε ένα αρχείο που λείπει να μην ακυρώνει την εγκατάσταση.
const REQUIRED_URLS = ['./', './index.html'];
const OPTIONAL_URLS = [
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './logo_poyef.png',
  './splash.png',
  './splash_fullscreen.png',
  './eidiko_misthologio_kat_g.xlsx'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) =>
    cache.addAll(REQUIRED_URLS).then(() => Promise.all(
      OPTIONAL_URLS.map((url) => cache.add(url).catch(() => undefined))
    ))
  ));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => key !== CACHE_NAME ? caches.delete(key) : Promise.resolve())
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => cached);
    })
  );
});
