/* scripts.js - CRUD for scripts vault */
(function () {
  requireAuth();
  initLogout();
  initTabs();
  bindModalClose('viewModal');
  bindModalClose('confirmModal');
  const KEY = STORAGE_KEYS.SCRIPTS;
  const form = document.getElementById('scriptForm');
  const idField = document.getElementById('scriptId');
  const clearBtn = document.getElementById('clearScript');
  function resetForm() { form.reset(); idField.value = ''; }
  clearBtn.addEventListener('click', resetForm);
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = {
      title: document.getElementById('sTitle').value.trim(),
      product: document.getElementById('sProduct').value.trim(),
      type: document.getElementById('sType').value,
      author: document.getElementById('sAuthor').value.trim(),
      date: document.getElementById('sDate').value,
      content: document.getElementById('sContent').value.trim()
    };
    if (!data.title || !data.product || !data.type || !data.author || !data.date || !data.content) {
      return showToast('Please fill all required fields', 'error');
    }
    if (idField.value) {
      updateData(KEY, idField.value, data);
      showToast('Script updated');
    } else {
      saveData(KEY, data);
      showToast('Script saved');
    }
    resetForm();
    renderAll();
  });
  function renderAll() {
    renderViewTable();
    renderSearchTable(document.getElementById('searchInput').value);
  }
  function renderViewTable() {
    const tbody = document.getElementById('scriptTable');
    const list = getData(KEY);
    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty">No scripts yet.</td></tr>';
      return;
    }
    tbody.innerHTML = list.map(s => `
      <tr>
        <td>${esc(s.title)}</td><td>${esc(s.product)}</td>
        <td><span class="badge">${esc(s.type)}</span></td>
        <td>${esc(s.author)}</td><td>${esc(s.date)}</td>
        <td class="row-actions">
          <button class="btn btn-outline btn-sm" data-view="${s.id}">View</button>
          <button class="btn btn-outline btn-sm" data-edit="${s.id}">Edit</button>
          <button class="btn btn-danger btn-sm" data-del="${s.id}">Delete</button>
        </td>
      </tr>
    `).join('');
    tbody.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => viewScript(b.dataset.view)));
    tbody.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => editScript(b.dataset.edit)));
    tbody.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => {
      confirmDelete(() => { deleteData(KEY, b.dataset.del); showToast('Script deleted'); renderAll(); });
    }));
  }
  function renderSearchTable(query = '') {
    const tbody = document.getElementById('searchTable');
    const q = query.trim().toLowerCase();
    const list = getData(KEY).filter(s =>
      !q ||
      s.product.toLowerCase().includes(q) ||
      s.type.toLowerCase().includes(q) ||
      s.author.toLowerCase().includes(q)
    );
    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty">No matches.</td></tr>';
      return;
    }
    tbody.innerHTML = list.map(s => `
      <tr>
        <td>${esc(s.title)}</td><td>${esc(s.product)}</td>
        <td>${esc(s.type)}</td><td>${esc(s.author)}</td><td>${esc(s.date)}</td>
      </tr>
    `).join('');
  }
  function viewScript(id) {
    const s = findById(KEY, id);
    if (!s) return;
    document.getElementById('vTitle').textContent = s.title;
    document.getElementById('vProduct').textContent = s.product;
    document.getElementById('vType').textContent = s.type;
    document.getElementById('vAuthor').textContent = s.author;
    document.getElementById('vDate').textContent = s.date;
    document.getElementById('vContent').textContent = s.content;
    document.getElementById('viewModal').classList.remove('hidden');
  }
  function editScript(id) {
    const s = findById(KEY, id);
    if (!s) return;
    idField.value = s.id;
    document.getElementById('sTitle').value = s.title;
    document.getElementById('sProduct').value = s.product;
    document.getElementById('sType').value = s.type;
    document.getElementById('sAuthor').value = s.author;
    document.getElementById('sDate').value = s.date;
    document.getElementById('sContent').value = s.content;
    document.querySelector('[data-tab="add"]').click();
  }
  document.getElementById('searchInput').addEventListener('input', e => renderSearchTable(e.target.value));
  function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
  }
  renderAll();
})();
