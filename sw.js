const CACHE_NAME = "aromantial-v1";
const urlsToCache = [ 
    "index.html",
    "style.css",
    "offline.html",
    "login.html",
    "icons/apple-touch-icon.png",
    "icons/icon-96x96.png",
    "icons/icon-192x192.png",
    "icons/icon-512x512.png"
];

self.addEventListener("install", event => {
    console.log("Service worker instalandose");
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys => 
            Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                .map(key => caches.delete(key))
            )
        )
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).catch(() => caches.match('offline.html'));
        })
    );
});

self.addEventListener("push", event => {
    const data = event.data ? event.data.text() : "Notificación sin texto";
    event.waitUntil(
        self.registration.showNotification("Mi PWA", {
            body: data,
            icon: "icons/icon-192x192.png",
            badge: "icons/icon-96x96.png"
        })
    );
});
