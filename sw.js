/* LinkDonkey: offline shell (network first, cached copy when offline) plus the Android share target.
   Supabase API calls are never cached. */
var C='linkdonkey-v2', SHARE='linkdonkey-share';
var LIB='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.2/dist/umd/supabase.js';
var SHELL=['./','./manifest.webmanifest','./icon-192.png','./icon-512.png',LIB];
self.addEventListener('install',function(e){e.waitUntil(caches.open(C).then(function(c){return c.addAll(SHELL);}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k.indexOf('linkdonkey-v')===0&&k!==C;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});

/* Share sheet: title, text and url become query parameters; a shared image is parked in a cache for the app to pick up. */
async function receiveShare(req){
  var home=self.registration.scope;
  try{
    var fd=await req.formData(),ps=new URLSearchParams();
    var map={title:'t',text:'text',url:'u'};
    Object.keys(map).forEach(function(k){var v=fd.get(k);if(v&&typeof v==='string')ps.set(map[k],v);});
    var fs=fd.getAll('shot').filter(function(f){return f&&typeof f!=='string'&&f.size;});
    if(fs.length){
      var c=await caches.open(SHARE);
      for(var i=0;i<fs.length;i++)await c.put('shared-shot-'+i,new Response(fs[i],{headers:{'Content-Type':fs[i].type||'image/jpeg'}}));
      ps.set('shot',String(fs.length));
    }
    return Response.redirect(home+'?'+ps.toString(),303);
  }catch(err){return Response.redirect(home,303);}
}
self.addEventListener('fetch',function(e){
  var r=e.request;
  if(r.method==='POST'){
    var pu=new URL(r.url);
    if(pu.origin===self.location.origin&&pu.pathname===new URL(self.registration.scope).pathname)e.respondWith(receiveShare(r));
    return;
  }
  if(r.method!=='GET')return;
  var u=new URL(r.url);
  if(u.origin!==self.location.origin&&r.url!==LIB)return;
  e.respondWith(fetch(r).then(function(res){
    if(res.ok){var copy=res.clone();caches.open(C).then(function(c){c.put(r.mode==='navigate'?'./':r,copy);});}
    return res;
  }).catch(function(){
    return caches.match(r.mode==='navigate'?'./':r,{ignoreSearch:true});
  }));
});
