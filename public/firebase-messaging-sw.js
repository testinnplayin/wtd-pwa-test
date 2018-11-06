// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.

importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');


// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.

firebase.initializeApp({
  'messagingSenderId': "370014858199"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

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
  '/styles/lists.css',
  '/manifest.json'
];

let dashboardCacheName = 'dashboard-Cache',
  version = 0;


self.addEventListener('install', function(e) {
  console.log('[Service Worker] in process of installing! ', version);
  version ++;

  e.waitUntil(
      caches.open(dashboardCacheName + '-v' + version.toString())
          .then(function(cache) {
              // console.log('[Service Worker] caching app shell');
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
  // console.log('[Service Worker] fetching ', e.request.url);
  // if it is a dashboard request then run this code
  if (dashboardURLs.indexOf(e.request.url) > - 1) {
      // console.log('[Service Worker] ' + e.request.url + 'dashboard request exists in cache');
      e.respondWith(
          caches.open(dashboardCacheName + '-v' + version.toString())
              .then(function(cache) {
                  return fetch(e.request)
                      .then(function(response) {
                          cache.put(e.request.url, response.clone());
  
                          return response;
                      })
                      .catch(err => console.error(`[Service Worker] Error: ${err}`));
              })
      );
  } else if (dashboardURLs.indexOf(e.request.url) < 0) {
      // if it isn't a dashboard request, then run this code
      // console.log('[Service Worker] ' + e.request.url + ' non dashboard request cache');
      
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

// someone's wonderful workaround to fix FCM bug
class CustomPushEvent extends Event {
  constructor(data) {
    super('push')
    
    Object.assign(this, data)
    this.custom = true
  }
}

/*
 * Overrides push notification data, to avoid having 'notification' key and firebase blocking
 * the message handler from being called
 */
self.addEventListener('push', (e) => {
  console.log('[Service Worker] heard a push ', e);
  // Skip if event is our own custom event
  if (e.custom) return;

  // Kep old event data to override
  let oldData = e.data

  // Create a new event to dispatch
  let newEvent = new CustomPushEvent({
    data: {
      json() {
        let newData = oldData.json()
        newData._notification = newData.notification
        delete newData.notification
        return newData
      },
    },

    waitUntil: e.waitUntil.bind(e),
  })

  // Stop event propagation
  e.stopImmediatePropagation()

  // Dispatch the new wrapped event
  dispatchEvent(newEvent)
})

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('FIREBASE SERVICE WORKER payload ', payload);
  return self.registration.showNotification(payload.data.title, { body : payload.data.tMsg });
});

self.addEventListener('notificationclick', function(e) {
  console.log('CLICK ', e);

  e.notification.close();

  e.waitUntil(clients.matchAll({ type : 'window' })
    .then(function(clientList) {
      console.log('client List ', clientList);
      const cLng = clientList.length;
      for (let i = 0; i < cLng; i++) {
        const client = clientList[i];
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    }))
});