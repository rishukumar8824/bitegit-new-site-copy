// Keeps Render free-tier server warm by pinging every 8 minutes
(function(){
  function ping(){ fetch('/api/health',{method:'GET',cache:'no-store'}).catch(function(){}); }
  ping();
  setInterval(ping, 8 * 60 * 1000);
})();
