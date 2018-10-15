'use strict';

const dashboardURLs = [
    'http://localhost:3000/api/dashboard/thingamabobs/count',
    'http://localhost:3000/api/dashboard/dohickies/count',
    'http://localhost:3000/api/dashboard/thingamabobs/table',
    'http://localhost:3000/api/dashboard/dohickies/table'
],
    filesToCache = [
    '/',
    '/index.html',
    '/views/list.html',
    '/index.js',
    '/scripts/lists/lists.js',
    '/styles/normalize.css',
    '/styles/main.css',
    '/styles/index.css',
    '/styles/lists.css'
];

let dashboardCacheName = 'dashboard-Cache',
    version = 0;


self.addEventListener('install', function(e) {
    console.log('[Service Worker] in process of installing! ', version);
    version ++;

    e.waitUntil(
        caches.open(dashboardCacheName + '-v' + version.toString())
            .then(function(cache) {
                console.log('[Service Worker] caching app shell');
                return cache.addAll(filesToCache);
            })
    );
});

self.addEventListener('activate', function(e) {
    console.log('[Service Worker] is activated ', version);
    
    e.waitUntil(
        caches.keys()
            .then(function(keyList) {
                return Promise.all(keyList.map(function(key) {
                    if (!key.includes(version)) {
                        return caches.delete(key);
                    }
                }));
            })
    );

    return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
    console.log('[Service Worker] fetching ', e.request.url);

    if (dashboardURLs.indexOf(e.request.url) > - 1) {
        console.log('[Service Worker] ' + e.request.url + 'dashboard request exists in cache');
        e.respondWith(
            caches.open(dashboardCacheName + '-v' + version.toString())
                .then(function(cache) {
                    return fetch(e.request)
                        .then(function(response) {
                            cache.put(e.request.url, response.clone());
    
                            return response;
                        });
                })
        );
    } else if (dashboardURLs.indexOf(e.request.url) < 0) {
        // NOTE: see if have to readd e.request.url including api in it
        console.log('[Service Worker] ' + e.request.url + ' non dashboard request cache');
        e.respondWith(
            caches.match(e.request)
                .then(function(response) {
                    console.log('Exists in cache');
                    return response || fetch(e.request);
                })
        );
    }
    
});