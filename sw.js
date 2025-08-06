// sw.js
const CACHE_NAME = '4re5-cache-v1';
const urlsToCache = [
    'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js',
    'https://raw.githubusercontent.com/4re5group/4re5group.github.io/main/header.html',
    'https://raw.githubusercontent.com/4re5group/4re5group.github.io/main/footer.html',
    'https://api.github.com/users/4re5group/repos',
    'https://api.github.com/repos/4RE5group/4RE5group.github.io/contents/products'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request)
                    .then(response => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        return response;
                    });
            })
    );
});
