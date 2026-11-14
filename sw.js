// Inspección AIS San José · caché sin conexión
// v6: fotos desde galería con fecha de toma, duplicar en el esquema, aviso de respaldo
// v5: lista RUD desde el consolidado, con observaciones
// v4: búsqueda en la lista RUD local
// v3: imágenes de la ficha y coordenadas en archivos aparte; capas con cruce urbano-rural
// Al cambiar cualquier archivo de la app, suba también este archivo con un número de versión nuevo.
const V='inspAIS-v6';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png',
  './js/casillas.js',
  './img/ficha_p1.png','./img/ficha_p2.png','./img/ficha_p3.png','./img/ficha_p4.png',
  './img/logo_alcaldia.jpg','./img/logo_gobernacion.jpg','./img/logo_ais.jpg'];
const CAPAS=['./predios_urbanos.json','./predios_rurales.json'];
// cache:'reload' evita que la instalación tome copias viejas guardadas por el navegador
const fresh=u=>new Request(u,{cache:'reload'});
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(async c=>{await c.addAll(CORE.map(fresh));await Promise.all(CAPAS.map(u=>c.add(fresh(u)).catch(()=>{})))}).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// Abre desde caché (rápido y sin señal) y actualiza en segundo plano cuando hay conexión.
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>{
    const net=fetch(e.request).then(r=>{if(r&&r.ok){const cp=r.clone();caches.open(V).then(c=>c.put(e.request,cp))}return r}).catch(()=>hit);
    return hit||net;
  }));
});
