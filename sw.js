// Nombre de la caché
const CACHE_NAME = 'prudencia-cache-v1';

// Archivos para guardar en caché
const urlsToCache = [
  '.',
  'index.html'
  // NOTA: Tailwind se carga desde una CDN, por lo que no lo guardamos en caché.
  // La app necesitará internet la PRIMERA vez para cargar Tailwind,
  // pero el HTML principal y la lógica funcionarán offline.
];

// Instalación del Service Worker: se abre la caché y se añaden los archivos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caché abierta');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento 'fetch': cómo se manejan las peticiones
self.addEventListener('fetch', event => {
  event.respondWith(
    // 1. Busca en la caché primero
    caches.match(event.request)
      .then(response => {
        // Si la encuentra en caché, la devuelve
        if (response) {
          return response;
        }
        
        // Si no, la busca en la red
        return fetch(event.request);
      })
  );
});

// Evento 'activate': limpia cachés antiguas si es necesario
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Borra las cachés que no estén en la whitelist
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});