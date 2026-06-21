const STORAGE_KEYS = {
  CREATORS: 'creators',
  SCRIPTS: 'scripts',
  COLLABORATIONS: 'collaborations',
  DELIVERABLES: 'deliverables',
  DISPATCHES: 'dispatches',
  AUTH: 'cc_auth'
};
/** Get an array of records from localStorage */
function getData(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('getData error', e);
    return [];
  }
}
/** Save a new record (auto-assigns id) and return it */
function saveData(key, record) {
  const list = getData(key);
  record.id = record.id || Date.now().toString() + Math.floor(Math.random() * 999);
  list.push(record);
  localStorage.setItem(key, JSON.stringify(list));
  return record;
}
/** Update a record by id */
function updateData(key, id, updates) {
  const list = getData(key);
  const idx = list.findIndex(r => r.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...updates };
  localStorage.setItem(key, JSON.stringify(list));
  return list[idx];
}
/** Delete a record by id */
function deleteData(key, id) {
  const list = getData(key).filter(r => r.id !== id);
  localStorage.setItem(key, JSON.stringify(list));
}
/** Find a single record by id */
function findById(key, id) {
  return getData(key).find(r => r.id === id) || null;
}
/* -------- Shared UI Helpers -------- */
/** Toast notification */
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return alert(message);
  toast.textContent = message;
  toast.className = 'toast ' + type;
  setTimeout(() => toast.classList.add('hidden'), 2500);
}
/** Simple tab switching for pages with .tabs / .tab-btn / .tab-panel */
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById('tab-' + tab);
      if (panel) panel.classList.add('active');
    });
  });
}
/** Logout helper */
function initLogout() {
  const btn = document.getElementById('logoutBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    window.location.href = 'index.html';
  });
}
/** Auth guard for protected pages */
function requireAuth() {
  if (!localStorage.getItem(STORAGE_KEYS.AUTH)) {
    window.location.href = 'index.html';
  }
}
/** Confirmation modal helper */
function confirmDelete(onConfirm) {
  const modal = document.getElementById('confirmModal');
  const yes = document.getElementById('confirmYes');
  if (!modal || !yes) {
    if (confirm('Delete this record?')) onConfirm();
    return;
  }
  modal.classList.remove('hidden');
  // Replace button to clear past listeners
  const fresh = yes.cloneNode(true);
  yes.parentNode.replaceChild(fresh, yes);
  fresh.addEventListener('click', () => {
    onConfirm();
    modal.classList.add('hidden');
  });
  modal.querySelectorAll('[data-close]').forEach(el => {
    el.addEventListener('click', () => modal.classList.add('hidden'));
  });
}
/** Generic modal close helper */
function bindModalClose(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.querySelectorAll('[data-close]').forEach(el =>
    el.addEventListener('click', () => modal.classList.add('hidden'))
  );
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.classList.add('hidden');
  });
}
