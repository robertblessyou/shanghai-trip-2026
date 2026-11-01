(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.TripUtils=factory();})(typeof self!=='undefined'?self:this,function(){
  function isShareable(base){const u=new URL(base);const h=u.hostname.toLowerCase();return u.protocol==='https:'&&!(/^(localhost|127\.|0\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|\[?::1\]?$)/.test(h)||h.endsWith('.localhost')||h.endsWith('.local')||/^\[(fc|fd|fe80:)/i.test(h));}
  function shareURL(base,section){const u=new URL('index.html',base);u.search='';u.hash=/^(day[1-4]|catalog)$/.test(section)?section:'day1';return u.href;}
  return {isShareable,shareURL};
});
