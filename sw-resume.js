// sw-resume.js
const RESUME_PATH = '/assets/ANUJ%20resume.pdf';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (event) => {
  try {
    const url = new URL(event.request.url);
    if (event.request.method === 'GET' && url.pathname === RESUME_PATH) {
      event.respondWith((async () => {
        // network-first: try network (force revalidation)
        try {
          return await fetch(event.request, { cache: 'no-store', mode: 'cors' });
        } catch (err) {
          // falling back to normal fetch (may be cached) if network fails
          return fetch(event.request);
        }
      })());
      return;
    }
  } catch (err) { /* ignore */ }
  // other requests: no change
});
