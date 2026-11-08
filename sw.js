const CACHE = 'mizan-32d168e';
const FILES = [
 "./",
 "assets/AssetManifest.bin",
 "assets/AssetManifest.bin.json",
 "assets/FontManifest.json",
 "assets/NOTICES",
 "assets/assets/fonts/Amiri-Bold.ttf",
 "assets/assets/fonts/Amiri-OFL.txt",
 "assets/assets/fonts/Amiri-Regular.ttf",
 "assets/assets/fonts/NotoSansHebrew-OFL.txt",
 "assets/assets/fonts/NotoSansHebrew.ttf",
 "assets/assets/fonts/Tajawal-Bold.ttf",
 "assets/assets/fonts/Tajawal-ExtraBold.ttf",
 "assets/assets/fonts/Tajawal-Medium.ttf",
 "assets/assets/fonts/Tajawal-OFL.txt",
 "assets/assets/fonts/Tajawal-Regular.ttf",
 "assets/assets/images/emblem.png",
 "assets/assets/images/logo.png",
 "assets/fonts/MaterialIcons-Regular.otf",
 "assets/fonts/fallback/Roboto-Regular.ttf",
 "assets/shaders/ink_sparkle.frag",
 "assets/shaders/stretch_effect.frag",
 "canvaskit/canvaskit.js",
 "canvaskit/canvaskit.js.symbols",
 "canvaskit/canvaskit.wasm",
 "canvaskit/chromium/canvaskit.js",
 "canvaskit/chromium/canvaskit.js.symbols",
 "canvaskit/chromium/canvaskit.wasm",
 "canvaskit/skwasm.js",
 "canvaskit/skwasm.js.symbols",
 "canvaskit/skwasm.wasm",
 "canvaskit/skwasm_heavy.js",
 "canvaskit/skwasm_heavy.js.symbols",
 "canvaskit/skwasm_heavy.wasm",
 "canvaskit/webparagraph/canvaskit.js",
 "canvaskit/webparagraph/canvaskit.js.symbols",
 "canvaskit/webparagraph/canvaskit.wasm",
 "canvaskit/wimp.js",
 "canvaskit/wimp.js.symbols",
 "canvaskit/wimp.wasm",
 "favicon.png",
 "flutter.js",
 "flutter_bootstrap.js",
 "flutter_service_worker.js",
 "icons/Icon-192.png",
 "icons/Icon-512.png",
 "icons/Icon-maskable-192.png",
 "icons/Icon-maskable-512.png",
 "icons/apple-touch-icon.png",
 "index.html",
 "main.dart.js",
 "manifest.json",
 "sqflite_sw.js",
 "sqlite3.wasm",
 "version.json"
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// أولاً من التخزين (أوفلاين)، وإذا مش موجود من الشبكة
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      return fetch(e.request).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      }).catch(() => caches.match('./'));
    })
  );
});
