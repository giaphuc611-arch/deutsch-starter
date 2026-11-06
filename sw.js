/* PWA offline cache. Change CACHE_VERSION with each content update. */
const CACHE_VERSION='deutsch-starter-a0-b1-v3-20261106-2';
const FILES=['./','./index.html','./style.css','./app.js','./content.js','./exams.js','./manifest.webmanifest','./icon.svg','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE_VERSION).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('deutsch-starter-')&&k!==CACHE_VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
 const url=new URL(event.request.url);
 if(url.pathname.endsWith('/__health'))return;
 // Navigation: network first, cached fallback. Static files: cached first for truly offline use.
 if(event.request.mode==='navigate')event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE_VERSION).then(c=>c.put(event.request,copy));}return response;}).catch(()=>caches.match(event.request).then(res=>res||caches.match('./index.html'))));
 else event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE_VERSION).then(c=>c.put(event.request,copy));}return response;})));
});
