/* collaboration.js - manage campaigns, dispatch, deliverables */
(function () {
  requireAuth();
  initLogout();
  initTabs();
  bindModalClose('confirmModal');
  const COLLABS = STORAGE_KEYS.COLLABORATIONS;
  const DISPATCH = STORAGE_KEYS.DISPATCHES;
  const DELIV = STORAGE_KEYS.DELIVERABLES;
  const BARTER_STATUSES = [
    'Planned', 'Product Sent', 'Delivered',
    'Content Pending', 'Content Received', 'Completed'
  ];
  const DELIV_STATUSES = ['Pending', 'Submitted', 'Approved'];
  /* ---------- Create Collaboration ---------- */
  document.getElementById('collabForm').addEventListener('submit', e => {
    e.preventDefault();
    const data = {
      name: val('coName'), platform: val('coPlatform'),
      product: val('coProduct'), campaignType: val('coType'),
      dispatchDate: val('coDispatch'), deliverableDate: val('coDeliv'),
      status: 'Planned'
    };
    if (!data.name || !data.platform || !data.product || !data.campaignType) {
      return showToast('Please fill all required fields', 'error');
    }
    saveData(COLLABS, data);
    showToast('Collaboration created');
    e.target.reset();
    renderBarter();
  });
  /* ---------- Barter Tracker ---------- */
  function renderBarter() {
    const tbody = document.getElementById('barterTable');
    const list = getData(COLLABS);
    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty">No collaborations yet.</td></tr>';
      return;
    }
    tbody.innerHTML = list.map(c => `
      <tr>
        <td>${esc(c.name)}</td><td>${esc(c.product)}</td>
        <td><span class="badge">${esc(c.campaignType)}</span></td>
        <td>
          <select class="status-select" data-id="${c.id}">
            ${BARTER_STATUSES.map(s =>
              `<option value="${s}" ${s === (c.status || 'Planned') ? 'selected' : ''}>${s}</option>`
            ).join('')}
          </select>
        </td>
        <td><button class="btn btn-danger btn-sm" data-del="${c.id}">Delete</button></td>
      </tr>
    `).join('');
    tbody.querySelectorAll('.status-select').forEach(sel =>
      sel.addEventListener('change', () => {
        updateData(COLLABS, sel.dataset.id, { status: sel.value });
        showToast('Status updated');
      })
    );
    tbody.querySelectorAll('[data-del]').forEach(b =>
      b.addEventListener('click', () =>
        confirmDelete(() => { deleteData(COLLABS, b.dataset.del); showToast('Removed'); renderBarter(); })
      )
    );
  }
  /* ---------- Dispatch ---------- */
  document.getElementById('dispatchForm').addEventListener('submit', e => {
    e.preventDefault();
    const data = {
      name: val('dName'), product: val('dProduct'),
      qty: val('dQty'), date: val('dDate'), tracking: val('dTrack')
    };
    if (!data.name || !data.product || !data.qty || !data.date) {
      return showToast('Please fill all required fields', 'error');
    }
    saveData(DISPATCH, data);
    showToast('Dispatch logged');
    e.target.reset();
    renderDispatch();
  });
  function renderDispatch() {
    const tbody = document.getElementById('dispatchTable');
    const list = getData(DISPATCH);
    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty">No dispatches yet.</td></tr>';
      return;
    }
    tbody.innerHTML = list.map(d => `
      <tr>
        <td>${esc(d.name)}</td><td>${esc(d.product)}</td>
        <td>${esc(d.qty)}</td><td>${esc(d.date)}</td>
        <td>${esc(d.tracking || '-')}</td>
        <td><button class="btn btn-danger btn-sm" data-del="${d.id}">Delete</button></td>
      </tr>
    `).join('');
    tbody.querySelectorAll('[data-del]').forEach(b =>
      b.addEventListener('click', () =>
        confirmDelete(() => { deleteData(DISPATCH, b.dataset.del); showToast('Removed'); renderDispatch(); })
      )
    );
  }
  /* ---------- Deliverables ---------- */
  document.getElementById('delivForm').addEventListener('submit', e => {
    e.preventDefault();
    const data = {
      name: val('dvName'), platform: val('dvPlatform'),
      type: val('dvType'), due: val('dvDue'), status: val('dvStatus')
    };
    if (!data.name || !data.platform || !data.type || !data.due) {
      return showToast('Please fill all required fields', 'error');
    }
    saveData(DELIV, data);
    showToast('Deliverable added');
    e.target.reset();
    renderDeliv();
  });
  function renderDeliv(query = '') {
    const tbody = document.getElementById('delivTable');
    const q = query.trim().toLowerCase();
    const list = getData(DELIV).filter(d =>
      !q ||
      d.name.toLowerCase().includes(q) ||
      d.platform.toLowerCase().includes(q) ||
      d.type.toLowerCase().includes(q) ||
      d.status.toLowerCase().includes(q)
    );
    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty">No deliverables.</td></tr>';
      return;
    }
    tbody.innerHTML = list.map(d => `
      <tr>
        <td>${esc(d.name)}</td><td>${esc(d.platform)}</td>
        <td>${esc(d.type)}</td><td>${esc(d.due)}</td>
        <td>
          <select class="status-select" data-id="${d.id}">
            ${DELIV_STATUSES.map(s =>
              `<option value="${s}" ${s === d.status ? 'selected' : ''}>${s}</option>`
            ).join('')}
          </select>
        </td>
        <td><button class="btn btn-danger btn-sm" data-del="${d.id}">Delete</button></td>
      </tr>
    `).join('');
    tbody.querySelectorAll('.status-select').forEach(sel =>
      sel.addEventListener('change', () => {
        updateData(DELIV, sel.dataset.id, { status: sel.value });
        showToast('Status updated');
      })
    );
    tbody.querySelectorAll('[data-del]').forEach(b =>
      b.addEventListener('click', () =>
        confirmDelete(() => { deleteData(DELIV, b.dataset.del); showToast('Removed'); renderDeliv(document.getElementById('delivSearch').value); })
      )
    );
  }
  document.getElementById('delivSearch').addEventListener('input', e => renderDeliv(e.target.value));
  /* helpers */
  function val(id) { return document.getElementById(id).value.trim(); }
  function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
  }
  renderBarter();
  renderDispatch();
  renderDeliv();
})();
