// JS/SJS/TAG/updateConn.js
export function initConnectionStatus(statusConnEl){
  if(!statusConnEl) return;
  function updateConn(){
    statusConnEl.textContent = navigator.onLine ? 'Online' : 'Offline';
  }
  window.addEventListener('online', updateConn);
  window.addEventListener('offline', updateConn);
  updateConn();
}
