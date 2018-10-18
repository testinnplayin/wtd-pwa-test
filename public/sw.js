'use strict';

const dashboardURLs = [
    'https://192.168.1.46:3000/api/dashboard/thingamabobs/count',
    'https://192.168.1.46:3000/api/dashboard/dohickies/count',
    'https://192.168.1.46:3000/api/dashboard/thingamabobs/table',
    'https://192.168.1.46:3000/api/dashboard/dohickies/table'
],
    filesToCache = [
    '/',
    '/index.html',
    '/views/list.html',
    '/index.js',
    '/api-res.js',
    '/scripts/lists/lists.js',
    '/scripts/constants/lists.js',
    '/scripts/dashboard/table-data.js',
    '/scripts/helpers/renderers.js',
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
    // if it is a dashboard request then run this code
    if (dashboardURLs.indexOf(e.request.url) > - 1) {
        console.log('[Service Worker] ' + e.request.url + 'dashboard request exists in cache');
        e.respondWith(
            caches.open(dashboardCacheName + '-v' + version.toString())
                .then(function(cache) {
                    return fetch(e.request)
                        .then(function(response) {
                            console.log('response inside requests ', response);
                            cache.put(e.request.url, response.clone());
    
                            return response;
                        })
                        .catch(err => console.error(`[Service Worker] Error: ${err}`));
                })
        );
    } else if (dashboardURLs.indexOf(e.request.url) < 0) {
        // if it isn't a dashboard request, then run this code
        console.log('[Service Worker] ' + e.request.url + ' non dashboard request cache');
        
        // the list.html file is not directly linked so if the sw does a localhost:3000/list/thingamabobs it returns an error
        // the first block of code runs when the fetch request is NOT directed at list
        if (!e.request.url.includes('/list/')) {
            // NOTE: have to pass in e.request.url because otherwise the js files are not served properly... for some reason e.request works with css and html files just fine
            e.respondWith(
                caches.match(e.request.url)
                    .then(function(response) {
                        // console.log('Exists in cache ', response);
                        return response || fetch(e.request)
                            .catch(function(err) {
                                console.error(`[Service Worker] Error: ${err}`);
                            });
                    })
            );
        } else {
            e.respondWith(
                caches.match('/views/list.html')
                    .then(function(response) {
                        return response || fetch(e.request)
                            .catch(function(err) {
                                console.error(`[Service Worker] Error: ${err}`);
                            });
                    })
            )
        }
    }
    
});

self.addEventListener('push', function(e) {
    console.log('[Service Worker] heard a push event');
});