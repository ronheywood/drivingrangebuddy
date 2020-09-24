var cacheName = 'drivingrangebuddy-pwa';
var filesToCache = [
    '/',
    '/index.html',
    '/css/bootstrap.min.css',
    '/css/bootstrap.min.css.map',
    '/css/app.css',
    '/img/golf-field.svg',
    '/js/app.js',
    '/js/bootstrap.bundle.min.js',
    '/js/bootstrap.bundle.min.js.map',
    '/js/jquery.slim.min.js',
    '/js/jquery.clublist.js',
    '/js/jquery.dispersion-recorder.js',
    '/js/jquery.randomDistance.js'];

self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            return cache.addAll(filesToCache);
        })
    );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function (e) {
    e.respondWith(caches.match(e.request).then(function (response) {
        return response || fetch(e.request);
    })
    );
});