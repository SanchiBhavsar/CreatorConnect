/* creator.js - CRUD for creators */
(function () {
  requireAuth();
  initLogout();
  initTabs();
  bindModalClose('viewModal');
  bindModalClose('confirmModal');
  const KEY = STORAGE_KEYS.CREATORS;
  const STATUS_OPTIONS = [
    'Not Contacted', 'Contacted', 'Interested',
    'Product Sent', 'Content Received', 'Completed'
  ];
  const form = document.getElementById('creatorForm');
  const idField = document.getElementById('creatorId');
  const clearBtn = document.getElementById('clearCreator');
  function resetForm() {
    form.reset();
    idField.value = '';
  }
  clearBtn.addEventListener('click', resetForm);
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = {
      name: document.getElementById('cName').value.trim(),
      handle: document.getElementById('cHandle').value.trim(),
      platform: document.getElementById('cPlatform').value,
      followers: document.getElementById('cFollowers').value,
      category: document.getElementById('cCategory').value,
      email: document.getElementById('cEmail').value.trim(),
      contact: document.getElementById('cContact').value.trim(),
      notes: document.getElementById('cNotes').value.trim(),
      status: 'Not Contacted'
    };
    // Validation
    if (!data.name || !data.handle || !data.platform || !data.followers || !data.category || !data.email) {
      return showToast('Please fill all required fields', 'error');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return showToast('Invalid email format', 'error');
    }
    if (isNaN(Number(data.followers)) || Number(data.followers) < 0) {
      return showToast('Followers must be a positive number', 'error');
    }
    data.followers = Number(data.followers);
    if (idField.value) {
      updateData(KEY, idField.value, data);
      showToast('Creator updated');
    } else {
      saveData(KEY, data);
      showToast('Creator saved');
    }
    resetForm();
    renderAll();
  });
  function renderAll() {
    renderViewTable();
    renderSearchTable(document.getElementById('searchInput').value);
    renderStatusTable();
  }
  function renderViewTable() {
    const tbody = document.getElementById('creatorTable');
    const list = getData(KEY);
    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="empty">No creators yet.</td></tr>';
      return;
    }
    tbody.innerHTML = list.map(c => `
      <tr>
        <td>${escapeHtml(c.name)}</td>
        <td>${escapeHtml(c.handle)}</td>
        <td>${escapeHtml(c.platform)}</td>
        <td>${Number(c.followers).toLocaleString()}</td>
        <td>${escapeHtml(c.category)}</td>
        <td><span class="badge">${escapeHtml(c.status || 'Not Contacted')}</span></td>
        <td class="row-actions">
          <button class="btn btn-outline btn-sm" data-view="${c.id}">View</button>
          <button class="btn btn-outline btn-sm" data-edit="${c.id}">Edit</button>
          <button class="btn btn-danger btn-sm" data-del="${c.id}">Delete</button>
        </td>
      </tr>
    `).join('');
    tbody.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => viewCreator(b.dataset.view)));
    tbody.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => editCreator(b.dataset.edit)));
    tbody.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => {
      confirmDelete(() => { deleteData(KEY, b.dataset.del); showToast('Creator deleted'); renderAll(); });
    }));
  }
  function renderSearchTable(query = '') {
    const tbody = document.getElementById('searchTable');
    const q = query.trim().toLowerCase();
    const list = getData(KEY).filter(c =>
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.handle.toLowerCase().includes(q) ||
      c.platform.toLowerCase().includes(q)
    );
    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty">No matches.</td></tr>';
      return;
    }
    tbody.innerHTML = list.map(c => `
      <tr>
        <td>${escapeHtml(c.name)}</td><td>${escapeHtml(c.handle)}</td>
        <td>${escapeHtml(c.platform)}</td><td>${Number(c.followers).toLocaleString()}</td>
        <td>${escapeHtml(c.category)}</td>
      </tr>
    `).join('');
  }
  function renderStatusTable() {
    const tbody = document.getElementById('statusTable');
    const list = getData(KEY);
    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="empty">No creators yet.</td></tr>';
      return;
    }
    tbody.innerHTML = list.map(c => `
      <tr>
        <td>${escapeHtml(c.name)}</td>
        <td>${escapeHtml(c.handle)}</td>
        <td>${escapeHtml(c.platform)}</td>
        <td>
          <select class="status-select" data-id="${c.id}">
            ${STATUS_OPTIONS.map(s =>
              `<option value="${s}" ${s === (c.status || 'Not Contacted') ? 'selected' : ''}>${s}</option>`
            ).join('')}
          </select>
        </td>
      </tr>
    `).join('');
    tbody.querySelectorAll('.status-select').forEach(sel => {
      sel.addEventListener('change', () => {
        updateData(KEY, sel.dataset.id, { status: sel.value });
        showToast('Status updated');
        renderViewTable();
      });
    });
  }
  function viewCreator(id) {
    const c = findById(KEY, id);
    if (!c) return;
    document.getElementById('viewBody').innerHTML = `
      <p><strong>Name:</strong> ${escapeHtml(c.name)}</p>
      <p><strong>Handle:</strong> ${escapeHtml(c.handle)}</p>
      <p><strong>Platform:</strong> ${escapeHtml(c.platform)}</p>
      <p><strong>Followers:</strong> ${Number(c.followers).toLocaleString()}</p>
      <p><strong>Category:</strong> ${escapeHtml(c.category)}</p>
      <p><strong>Email:</strong> ${escapeHtml(c.email)}</p>
      <p><strong>Contact:</strong> ${escapeHtml(c.contact || '-')}</p>
      <p><strong>Status:</strong> ${escapeHtml(c.status || 'Not Contacted')}</p>
      <p><strong>Notes:</strong> ${escapeHtml(c.notes || '-')}</p>
    `;
    document.getElementById('viewModal').classList.remove('hidden');
  }
  function editCreator(id) {
    const c = findById(KEY, id);
    if (!c) return;
    idField.value = c.id;
    document.getElementById('cName').value = c.name;
    document.getElementById('cHandle').value = c.handle;
    document.getElementById('cPlatform').value = c.platform;
    document.getElementById('cFollowers').value = c.followers;
    document.getElementById('cCategory').value = c.category;
    document.getElementById('cEmail').value = c.email;
    document.getElementById('cContact').value = c.contact || '';
    document.getElementById('cNotes').value = c.notes || '';
    document.querySelector('[data-tab="add"]').click();
    showToast('Editing creator');
  }
  document.getElementById('searchInput').addEventListener('input', e => renderSearchTable(e.target.value));
  function escapeHtml(s) {
    return String(s ?? '').replace(/[&<>"']/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
  }
  renderAll();
})();