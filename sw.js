'use strict';
const VERSION='2026.11.01.3';
const PREFIX='shanghai-trip-'+new URL(self.registration.scope).pathname.replace(/[^a-z0-9]/gi,'_')+'-';
const CACHE=PREFIX+VERSION;
const CORE=['index.html','mobile.css','app.js','trip-utils.js','manifest.webmanifest','version.json','vendor/qrcode.js','icons/icon-192.png','icons/icon-512.png','icons/maskable-512.png','assets/shanghai-poster.png'];
const abs=p=>new URL(p,self.registration.scope).href;
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);await Promise.all(CORE.map(async file=>{const response=await fetch(new Request(abs(file),{cache:'reload'}));if(!response.ok)throw new Error('Missing core asset: '+file);await cache.put(abs(file),response)}))})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{await Promise.all((await caches.keys()).filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim()})()));
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING'){self.skipWaiting();return}if(event.data?.type==='CACHE_STATUS')event.waitUntil((async()=>{const cache=await caches.open(CACHE);const found=await Promise.all(CORE.map(p=>cache.match(abs(p))));event.ports[0]?.postMessage({version:VERSION,ready:found.every(Boolean),cached:found.filter(Boolean).length,expected:CORE.length})})())});
self.addEventListener('fetch',event=>{const u=new URL(event.request.url),scope=new URL(self.registration.scope);if(event.request.method!=='GET'||u.origin!==scope.origin||!u.pathname.startsWith(scope.pathname))return;event.respondWith((async()=>{const cache=await caches.open(CACHE);const relative=u.pathname.slice(scope.pathname.length);const key=relative===''||relative==='index.html'?abs('index.html'):new URL(u.pathname,u.origin).href;const found=await cache.match(key);
 // QA page can request a cache-only response without browser network access; user routes never add this header.
 if(event.request.headers.get('X-Trip-Cache-Only')==='1')return found||new Response('Not cached',{status:504});
 if(found)return found;
 try{return await fetch(event.request)}catch{return new Response('目前離線，這個內容尚未保存在裝置。請回到已儲存的行程。',{status:503,headers:{'Content-Type':'text/plain;charset=utf-8'}})}
})())});
