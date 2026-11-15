/******************************************************************************
 * RBT1 Robot Control
 * Service Worker
 *
 * Version : 1.0.0
 ******************************************************************************/

const CACHE_NAME = "rbt1-cache-v1";

/******************************************************************************
 * Fichiers mis en cache
 ******************************************************************************/

const STATIC_ASSETS = [

    "/",
    "/index.html",
    "/manifest.json",
    "/favicon.png"

];

/******************************************************************************
 * Installation
 ******************************************************************************/

self.addEventListener("install", event => {

    console.log("[SW] Install");

    event.waitUntil(

        caches.open(CACHE_NAME)

            .then(cache => {

                return cache.addAll(STATIC_ASSETS);

            })

    );

    self.skipWaiting();

});

/******************************************************************************
 * Activation
 ******************************************************************************/

self.addEventListener("activate", event => {

    console.log("[SW] Activate");

    event.waitUntil(

        caches.keys()

            .then(keys => {

                return Promise.all(

                    keys.map(key => {

                        if (key !== CACHE_NAME) {

                            return caches.delete(key);

                        }

                    })

                );

            })

    );

    self.clients.claim();

});

/******************************************************************************
 * Fetch
 ******************************************************************************/

self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(

        caches.match(event.request)

            .then(response => {

                if (response) {
                    return response;
                }

                return fetch(event.request)
                    .then(networkResponse => {

                        if (!networkResponse || networkResponse.status !== 200) {
                            return networkResponse;
                        }

                        const responseClone = networkResponse.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {

                                cache.put(event.request, responseClone);

                            });

                        return networkResponse;

                    });

            })

    );

});