// service-worker.js

// Nombre del caché y archivos que queremos almacenar
const CACHE_NAME = 'v1_cache_uma_clovr_pos';
const urlsToCache = [
    '/',
    '/index.php',
    '/css/styles.css',
    '/css/main.css',
    '/css/header.css',
    '/css/footer.css',
    '/css/keypad.css',
    '/css/root.css',
    '/js/keypad.js',
];

// Instalación del Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheWhitelist.indexOf(cacheName) === -1) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
    );
});

// Interceptar las solicitudes de red y responder con estrategia "network first"
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Si obtenemos una respuesta válida de la red, la clonamos y almacenamos en la caché.
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }
                const responseToCache = response.clone();
                caches.open(CACHE_NAME)
                    .then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                return response;
            })
            .catch(() => {
                // Si falla la solicitud de red, respondemos con el caché
                return caches.match(event.request)
                    .then(response => {
                        if (response) {
                            return response;
                        }
                        // Podemos manejar diferentes casos, por ejemplo, devolver un archivo predeterminado
                        if (event.request.mode === 'navigate') {
                            return caches.match('/index.php');
                        }
                    });
            })
    );
});
