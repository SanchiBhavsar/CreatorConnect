/* dashboard.js - load stats from local storage */
(function () {
  requireAuth();
  initLogout();
  const auth = JSON.parse(localStorage.getItem(STORAGE_KEYS.AUTH) || '{}');
  document.getElementById('loggedUser').textContent = auth.username || 'admin';
  const creators = getData(STORAGE_KEYS.CREATORS);
  const scripts = getData(STORAGE_KEYS.SCRIPTS);
  const collabs = getData(STORAGE_KEYS.COLLABORATIONS);
  const delivs = getData(STORAGE_KEYS.DELIVERABLES);
  const contacted = creators.filter(c => c.status && c.status !== 'Not Contacted').length;
  const activeCollabs = collabs.filter(c =>
    !['Completed'].includes(c.status || 'Planned')
  ).length;
  const pendingDelivs = delivs.filter(d => d.status === 'Pending').length;
  const barter = collabs.filter(c => c.campaignType === 'Barter' && (c.status || 'Planned') !== 'Completed').length;
  document.getElementById('statCreators').textContent = creators.length;
  document.getElementById('statContacted').textContent = contacted;
  document.getElementById('statActiveCollabs').textContent = activeCollabs;
  document.getElementById('statPendingDeliv').textContent = pendingDelivs;
  document.getElementById('statScripts').textContent = scripts.length;
  document.getElementById('statBarter').textContent = barter;
})();
