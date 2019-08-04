/* eslint-disable */
workbox.precaching.precacheAndRoute(self.__precacheManifest)

/* Template for API service worker */
// workbox.routing.registerRoute(
//   /https:\/\/api\.exchangeratesapi\.io\/latest/,
//   new workbox.strategies.NetworkFirst({
//     cacheName: "test",
//     plugins: [
//       new workbox.expiration.Plugin({
//         maxAgeSeconds: 10 * 60 // 10 minutes
//       })
//     ]
//   })
// );