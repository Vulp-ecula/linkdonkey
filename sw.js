/* LinkDonkey offline shell: network first, cached copy when offline. Supabase API calls are never cached. */
var C='linkdonkey-v1';
var LIB='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.2/dist/umd/supabase.js';
var SHELL=['./','./manifest.webmanifest','./icon-192.png','./icon-512.png',LIB];
self.addEventListener('install',function(e){e.waitUntil(caches.open(C).then(function(c){return c.addAll(SHELL);}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==C;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(e){
  var r=e.request;if(r.method!=='GET')return;
  var u=new URL(r.url);
  if(u.origin!==self.location.origin&&r.url!==LIB)return;
  e.respondWith(fetch(r).then(function(res){
    if(res.ok){var copy=res.clone();caches.open(C).then(function(c){c.put(r.mode==='navigate'?'./':r,copy);});}
    return res;
  }).catch(function(){
    return caches.match(r.mode==='navigate'?'./':r,{ignoreSearch:true});
  }));
});
